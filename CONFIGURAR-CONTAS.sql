-- Preencha os três e-mails das contas existentes em Authentication > Users.
-- Não cria contas nem senhas; vincula o ID imutável do Supabase.
begin;
do $$
declare
  jessica_email text := 'PREENCHER_EMAIL_JESSICA';
  grazi_email text := 'PREENCHER_EMAIL_GRAZI';
  gisele_email text := 'PREENCHER_EMAIL_GISELE';
  j uuid; g uuid; s uuid;
begin
  if lower(jessica_email)=lower(grazi_email) or lower(jessica_email)=lower(gisele_email)
    or lower(grazi_email)=lower(gisele_email) then raise exception 'Use três contas diferentes'; end if;
  select id into strict j from auth.users where lower(email)=lower(jessica_email) and email_confirmed_at is not null;
  select id into strict g from auth.users where lower(email)=lower(grazi_email) and email_confirmed_at is not null;
  select id into strict s from auth.users where lower(email)=lower(gisele_email) and email_confirmed_at is not null;
  insert into sali_private.acessos(user_id,papel) values (j,'admin'),(g,'produtos'),(s,'produtos')
  on conflict(user_id) do update set papel=excluded.papel;
end $$;
commit;
-- Confirme todos os acessos atribuídos. Outros acessos já existentes são preservados.
select u.email,a.papel from sali_private.acessos a join auth.users u on u.id=a.user_id order by u.email;
