-- Execute uma única vez no SQL Editor do Supabase. Depois, as mudanças são feitas pelo painel TROPICANAZ.
alter table public."Configuracoes_Loja"
  add column if not exists logo_url text,
  add column if not exists banner_url text,
  add column if not exists cor_dourada text default '#b58b45',
  add column if not exists fonte_titulo text default 'Georgia,serif',
  add column if not exists fonte_texto text default 'Arial,sans-serif',
  add column if not exists ordem_secoes jsonb default '["inicio","secaoBeneficios","categorias","novidades","editorial","cta"]'::jsonb,
  add column if not exists mostrar_novidades boolean default true;
