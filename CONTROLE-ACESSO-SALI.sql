-- Execute no SQL Editor como postgres. Faça backup das políticas antes.
-- Transação: erros desfazem todas as alterações desta migração.
begin;
create schema if not exists sali_private;
revoke all on schema sali_private from public, anon, authenticated;
grant usage on schema sali_private to anon, authenticated;
create table if not exists sali_private.acessos (
  user_id uuid primary key references auth.users(id) on delete cascade,
  papel text not null check (papel in ('admin','produtos'))
);
alter table sali_private.acessos enable row level security;
revoke all on sali_private.acessos from public, anon, authenticated;

-- Sem user_metadata, e-mail no navegador ou parâmetros controlados pelo usuário.
create or replace function sali_private.meu_papel()
returns text language sql stable security definer set search_path = ''
as $$ select papel from sali_private.acessos where user_id = (select auth.uid()) $$;
revoke all on function sali_private.meu_papel() from public, anon, authenticated;
-- Storage avalia também requisições anônimas. O helper só devolve o papel
-- do auth.uid() atual (NULL sem login), nunca o de um usuário arbitrário.
grant execute on function sali_private.meu_papel() to anon, authenticated;

-- Fachada invoker: não expõe funções elevadas na API pública.
create or replace function public.sali_meu_papel()
returns text language sql stable security invoker set search_path = ''
as $$ select sali_private.meu_papel() $$;
revoke all on function public.sali_meu_papel() from public, anon, authenticated;
grant execute on function public.sali_meu_papel() to authenticated;

-- Substitui políticas das cinco tabelas usadas pelo app; permissivas antigas
-- poderiam liberar acesso por OR. Não altera dados nem o formato das tabelas.
do $$
declare t text; p record;
begin
  foreach t in array array['Produtos','Fotos_Produtos','Variantes','Configuracoes_Loja','Pedidos'] loop
    if to_regclass(format('public.%I',t)) is null then
      raise exception 'Tabela obrigatória ausente: %',t;
    end if;
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I',p.policyname,t);
    end loop;
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public, anon, authenticated',t);
    execute format('grant select, insert, update, delete on public.%I to authenticated',t);
    execute format('grant all on public.%I to service_role',t);
    if t in ('Produtos','Fotos_Produtos','Variantes') then
      execute format('grant select on public.%I to anon',t);
      execute format('create policy sali_catalogo on public.%I for select to anon, authenticated using (true)',t);
      execute format('create policy sali_produtos_insert on public.%I for insert to authenticated with check ((select sali_private.meu_papel()) in (''admin'',''produtos''))',t);
      execute format('create policy sali_produtos_update on public.%I for update to authenticated using ((select sali_private.meu_papel()) in (''admin'',''produtos'')) with check ((select sali_private.meu_papel()) in (''admin'',''produtos''))',t);
      execute format('create policy sali_produtos_delete on public.%I for delete to authenticated using ((select sali_private.meu_papel()) in (''admin'',''produtos''))',t);
    elsif t = 'Configuracoes_Loja' then
      execute format('grant select on public.%I to anon',t);
      execute format('create policy sali_config_publica on public.%I for select to anon, authenticated using (true)',t);
      execute format('create policy sali_config_admin on public.%I for all to authenticated using ((select sali_private.meu_papel()) = ''admin'') with check ((select sali_private.meu_papel()) = ''admin'')',t);
    else
      execute format('create policy sali_pedidos_admin on public.%I for all to authenticated using ((select sali_private.meu_papel()) = ''admin'') with check ((select sali_private.meu_papel()) = ''admin'')',t);
    end if;
    -- Somente sequências vinculadas às colunas dessas tabelas.
    for p in
      select pg_get_serial_sequence(format('public.%I',t),a.attname) as seq
      from pg_attribute a where a.attrelid=to_regclass(format('public.%I',t))
        and a.attnum>0 and not a.attisdropped
    loop
      if p.seq is not null then
        execute format('revoke all on sequence %s from public, anon, authenticated',p.seq);
        execute format('grant usage on sequence %s to authenticated, service_role',p.seq);
      end if;
    end loop;
  end loop;
end $$;

-- O bucket existente permanece público para exibir fotos no catálogo.
-- Guardas restritivas bloqueiam regras antigas amplas para este bucket,
-- sem alterar o comportamento de outros buckets.
drop policy if exists sali_storage_insert_guard on storage.objects;
drop policy if exists sali_storage_update_guard on storage.objects;
drop policy if exists sali_storage_delete_guard on storage.objects;
drop policy if exists sali_storage_insert on storage.objects;
drop policy if exists sali_storage_update on storage.objects;
drop policy if exists sali_storage_delete on storage.objects;
drop policy if exists sali_storage_read on storage.objects;

create policy sali_storage_insert_guard on storage.objects as restrictive
for insert to anon, authenticated with check (
  bucket_id <> 'produtos' or
  case when (select auth.uid()) is null then false else
    (select sali_private.meu_papel()) = 'admin' or
    ((select sali_private.meu_papel()) = 'produtos' and
     (storage.foldername(name))[1] in ('produtos','galeria','variantes')) end
);
create policy sali_storage_update_guard on storage.objects as restrictive
for update to anon, authenticated
using (bucket_id <> 'produtos' or
  case when (select auth.uid()) is null then false else (select sali_private.meu_papel()) = 'admin' end)
with check (bucket_id <> 'produtos' or
  case when (select auth.uid()) is null then false else (select sali_private.meu_papel()) = 'admin' end);
create policy sali_storage_delete_guard on storage.objects as restrictive
for delete to anon, authenticated using (bucket_id <> 'produtos' or
  case when (select auth.uid()) is null then false else (select sali_private.meu_papel()) = 'admin' end);

create policy sali_storage_insert on storage.objects for insert to authenticated
with check (bucket_id = 'produtos' and (
  (select sali_private.meu_papel()) = 'admin' or
  ((select sali_private.meu_papel()) = 'produtos' and
   (storage.foldername(name))[1] in ('produtos','galeria','variantes'))
));
create policy sali_storage_update on storage.objects for update to authenticated
using (bucket_id = 'produtos' and (select sali_private.meu_papel()) = 'admin')
with check (bucket_id = 'produtos' and (select sali_private.meu_papel()) = 'admin');
create policy sali_storage_delete on storage.objects for delete to authenticated
using (bucket_id = 'produtos' and (select sali_private.meu_papel()) = 'admin');
create policy sali_storage_read on storage.objects for select to authenticated
using (bucket_id = 'produtos' and (select sali_private.meu_papel()) in ('admin','produtos'));
commit;
