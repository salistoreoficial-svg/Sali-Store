create table if not exists public.sali_categorias (id bigint generated always as identity primary key, nome text not null unique);
alter table public.sali_categorias enable row level security;
create policy "Leitura categorias" on public.sali_categorias for select using (true);
create policy "Admin cria categorias" on public.sali_categorias for insert to authenticated with check (exists (select 1 from public.sali_roles where user_id=auth.uid() and lower(role)='admin'));
