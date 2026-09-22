-- Execute UMA VEZ no SQL Editor do Supabase
alter table public."Configuracoes_Loja"
add column if not exists capas_categorias jsonb not null default '{}'::jsonb;
