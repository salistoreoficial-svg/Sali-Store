# SALI STORE — acesso de funcionárias

Preparado a partir de `Sali-Store-main (4).zip`, localizado nos Downloads. O `admin.html` indicado depois é idêntico ao do ZIP (comparação SHA-256).

## Resultado

| Conta | Acesso |
|---|---|
| Jéssica | Painel completo: início, pedidos, cancelamentos, produtos, aparência, entregas e pagamentos |
| Grazi e Gisele | Produtos: cadastrar, editar, ativar/desativar, excluir, fotos, cores, tamanhos e estoque |
| Conta sem atribuição | Sem acesso ao painel; mantém a leitura do catálogo público |

“Somente produtos” inclui gestão completa dos produtos, inclusive exclusão. As vendedoras podem substituir fotos vinculadas aos produtos enviando novos arquivos, mas não sobrescrever/excluir arquivos físicos no Storage. Somente admin modifica arquivos existentes e envia imagens de layout.

## Antes de implantar

1. Faça backup do projeto publicado e do banco pelo Supabase. Guarde também as políticas/grants atuais: a migração substitui as políticas das cinco tabelas do aplicativo.
2. Em **Authentication > Users**, identifique os e-mails exatos de Jéssica, Grazi e Gisele. Crie/convide as contas ausentes e confirme os e-mails. Não compartilhe a conta da administradora.
3. Preencha os três campos em `CONFIGURAR-CONTAS.sql`. O script exige três contas diferentes e confirmadas; caso falte alguma, desfaz a atribuição inteira. Usa os IDs das contas, portanto mudar o e-mail depois não muda o papel.
4. Confira que o bucket `produtos` existe e é público, como exigido pelas URLs atuais de fotos. Não adicione `sali_private` aos schemas expostos nas configurações da Data API.
5. Confirme as variáveis de ambiente existentes na Vercel, especialmente `SUPABASE_SECRET_KEY` e as de Mercado Pago. A chave secreta fica exclusivamente no servidor. O pedido público continua em `/api/pedido` e os webhooks continuam usando o acesso de servidor que ignora RLS.

## Aplicar

Use primeiro um projeto de teste com a mesma estrutura do banco, configurações e Storage. Não aponte os testes destrutivos para produção.

1. No SQL Editor do Supabase, como `postgres`, execute `CONTROLE-ACESSO-SALI.sql` inteiro. Ele roda em transação. Nenhum produto, pedido ou configuração é apagado. Durante o intervalo até o próximo passo, o painel fica sem acesso atribuído.
2. Execute `CONFIGURAR-CONTAS.sql` preenchido. Confirme que Jéssica aparece como `admin`, e Grazi/Gisele como `produtos`. A lista também mostra atribuições anteriores: revise e remova as que não devem existir.
3. Publique os arquivos do projeto atualizado no repositório conectado à Vercel e faça o deploy. Preserve `api/`, imagens, manifests, `produtos.js`, `index.html` e `vercel.json`. As alterações de código estão em `admin.html` e no identificador de versão de `sw.js`.
4. Os arquivos `.sql` e este manual são materiais de implantação: não precisam ser publicados na hospedagem. Não execute novamente os scripts antigos de permissões depois desta migração.
5. Reabra o painel em cada aparelho. Se necessário, feche e abra o app instalado ou recarregue a página. Entre com cada conta para conferir o resultado.

## Conferência no ambiente de teste

Use três perfis/janelas de navegador separados, além de uma janela sem login.

- **Grazi e Gisele:** abrir diretamente em Produtos; nenhuma aba de pedidos, cancelamentos, aparência ou configurações. Criar um produto de teste, incluir fotos e variantes, editar estoque, ativar/desativar e excluir o produto. Conferir o catálogo depois de cada alteração.
- **Jéssica:** acessar todas as abas, ler pedidos, mudar o status de um pedido de teste, salvar aparência, trocar banner e salvar entregas/pagamentos. Conferir o site.
- **Conta não atribuída:** autenticação válida, mas painel negado. Alterar `user_metadata` ou valores locais não concede papel.
- **Sem login:** consultar catálogo, fotos, variantes e configurações públicas. Criar um pedido de teste pelo checkout e confirmar que aparece para Jéssica; testar também o pagamento e webhook no modo de teste do Mercado Pago.
- **Logout:** painel some e o papel local é limpo. Entrar depois com uma vendedora não deve carregar pedidos/configurações administrativas.
- **Falha de rede/RPC:** o painel permanece fechado quando a permissão não pode ser verificada.

Teste também a API diretamente com o token autenticado de cada vendedora, independentemente da interface:

| Operação na Data API / Storage | Resultado esperado |
|---|---|
| `GET /rest/v1/rpc/sali_meu_papel` | `produtos` (RPC sem parâmetros, GET ou POST) |
| `GET /rest/v1/Pedidos?select=*` | lista vazia; nenhum pedido revelado |
| Inserir pedido diretamente em `Pedidos` | negado pelo RLS |
| Atualizar/excluir pedido ou configuração | nenhuma linha alterada; RLS pode retornar sucesso com zero linhas |
| Inserir/editar/excluir produtos, fotos e variantes | permitido |
| Upload novo no bucket `produtos`, pasta `galeria/` ou `variantes/` | permitido |
| Upload na pasta `layout/`, overwrite ou remoção física | negado |
| Alterar papel em `sali_private.acessos` pela API | schema/tabela indisponível |
| Mesmas gravações sem autenticação | negadas |

Nas requisições, use a chave **publicável** no header `apikey` e o token **da usuária** em `Authorization: Bearer ...`. Nunca use a chave secreta para testar RLS: ela contorna as políticas.

## Consultas de conferência

No SQL Editor:

```sql
select u.email,a.papel
from sali_private.acessos a join auth.users u on u.id=a.user_id;

select tablename,policyname,permissive,roles,cmd,qual,with_check
from pg_policies
where (schemaname='public' and tablename in
  ('Produtos','Fotos_Produtos','Variantes','Configuracoes_Loja','Pedidos'))
or (schemaname='storage' and tablename='objects');

-- Revogar uma atribuição (preencha o e-mail exato).
delete from sali_private.acessos
where user_id=(select id from auth.users where email='EMAIL_EXATO');
```

A revogação vale para a próxima operação no banco mesmo com sessão existente. A interface refaz a consulta ao abrir/recarregar o painel.

## Limites e verificação do banco existente

Não houve acesso ao banco real, à configuração da hospedagem ou aos tokens das três contas. A migração e o checkout devem ser validados no ambiente de teste antes de produção. Os testes locais passaram para sintaxe JavaScript, abertura por papel, consultas iniciais por papel, ações administrativas bloqueadas, upload de layout bloqueado, conta não atribuída, erro de permissão e logout. Foram testes com Supabase/DOM simulados; não substituem testes reais de RLS, Storage e pagamentos.

O ZIP não contém um inventário completo do banco. Antes de liberar as contas, revise views e funções RPC adicionais expostas que possam acessar `Pedidos`, configurações ou Storage com privilégios elevados; RLS nas tabelas não impede uma função `SECURITY DEFINER` insegura de contorná-lo. Também revise políticas de outros buckets e tabelas que não aparecem neste aplicativo. As guardas de Storage desta entrega protegem o bucket `produtos` sem alterar outros buckets.

```sql
-- Funções elevadas e views para revisar no painel do Supabase.
select n.nspname,p.proname,pg_get_function_identity_arguments(p.oid)
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.prosecdef;
select schemaname,viewname,definition from pg_views where schemaname='public';
```

As leituras públicas de Produtos/Fotos_Produtos/Variantes e Configuracoes_Loja foram mantidas para compatibilidade com o catálogo. Isso inclui produtos inativos e as colunas públicas existentes; não coloque segredos nessas tabelas. Pedidos são privados. Não foi alterado o comportamento preexistente de validação de preços, checkout ou webhooks.

## Recuperação

Se houver erro de atribuição, corrija os e-mails no SQL Editor e execute `CONFIGURAR-CONTAS.sql` novamente. Não habilite acesso por nome ou metadata. Se o painel apresentar regressão, recupere o deploy anterior e mantenha as políticas novas: a conta admin continua autorizada no banco, e as vendedoras continuam bloqueadas de pedidos/configurações. Restaurar as políticas antigas exige usar o backup e reabre as permissões antigas; faça isso somente após avaliar a causa.

Referências de implementação: [RLS do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) e [controle de acesso do Storage](https://supabase.com/docs/guides/storage/security/access-control).
