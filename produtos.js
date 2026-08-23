/* =========================================
   SALI STORE
   PRODUTOS + VARIANTES DO SUPABASE
========================================= */

const SALI_SUPABASE_URL =
"https://uubslcjoybeehinnwhtg.supabase.co";

const SALI_SUPABASE_KEY =
"sb_publishable_hJ_G5ZdzwAKR_zs7q4luqA_RIa-0Qiz";

let clienteProdutosSali = null;


/* =========================================
   CONECTAR AO SUPABASE
========================================= */

function conectarProdutosSali(){

  if(clienteProdutosSali){
    return true;
  }

  if(!window.supabase){
    return false;
  }

  /*
    Cliente exclusivamente público.

    Isso evita que o login do admin
    interfira nas policies públicas
    da loja.
  */

  clienteProdutosSali =
    window.supabase.createClient(
      SALI_SUPABASE_URL,
      SALI_SUPABASE_KEY,
      {
        auth:{
          persistSession:false,
          autoRefreshToken:false,
          detectSessionInUrl:false
        }
      }
    );

  return true;

}


/* =========================================
   CSS DOS SELETORES
========================================= */

function adicionarEstilosVariantes(){

  if(
    document.getElementById(
      "sali-estilos-variantes"
    )
  ){
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "sali-estilos-variantes";

  style.textContent = `

    .sali-variantes{
      margin-top:12px;
      display:grid;
      gap:10px;
    }

    .sali-campo-variante{
      display:grid;
      gap:5px;
    }

    .sali-campo-variante label{
      font-size:13px;
      font-weight:800;
      color:#222;
    }

    .sali-campo-variante select{
      width:100%;
      min-width:0;
      padding:10px 8px;
      border:1px solid #ddd;
      border-radius:9px;
      background:#fff;
      color:#111;
      font-size:13px;
      outline:none;
    }

    .sali-campo-variante select:focus{
      border-color:#e52d86;
    }

    .sali-estoque-variante{
      font-size:12px;
      color:#666;
      margin-top:2px;
    }

    .sali-estoque-variante.disponivel{
      color:#238a39;
      font-weight:700;
    }

    .sali-estoque-variante.esgotado{
      color:#c40000;
      font-weight:700;
    }

    .produto .adicionar:disabled{
      opacity:.5;
      cursor:not-allowed;
    }

  `;

  document.head.appendChild(
    style
  );

}


/* =========================================
   UTILIDADES
========================================= */

function moedaProduto(valor){

  return Number(
    valor || 0
  ).toLocaleString(
    "pt-BR",
    {
      style:"currency",
      currency:"BRL"
    }
  );

}


function textoSeguro(valor){

  return String(
    valor ?? ""
  ).trim();

}


function tamanhoExibicao(
  tamanho
){

  const valor =
    textoSeguro(
      tamanho
    );

  if(!valor){
    return "";
  }

  const normalizado =
    valor
    .toLowerCase()
    .replace(
      "único",
      "unico"
    );

  if(
    normalizado.includes(
      "tamanho unico"
    )
    ||
    normalizado.includes(
      "veste 36 ao 42"
    )
  ){

    return "Tamanho único (veste 36 ao 42 ✅)";

  }

  return valor;

}


function chaveVisual(
  variante
){

  const cor =
    textoSeguro(
      variante.cor
    );

  const estampa =
    textoSeguro(
      variante.estampa
    );

  return (
    cor +
    "|||" +
    estampa
  );

}


function nomeVisual(
  variante
){

  const cor =
    textoSeguro(
      variante.cor
    );

  const estampa =
    textoSeguro(
      variante.estampa
    );

  if(
    cor &&
    estampa
  ){

    /*
      Exemplo:
      Estampado • Estampa 01
    */

    return (
      cor +
      " • " +
      estampa
    );

  }

  if(estampa){
    return estampa;
  }

  if(cor){
    return cor;
  }

  return "";

}


function detalhesVariante(
  variante
){

  if(!variante){
    return "";
  }

  const detalhes = [];

  const visual =
    nomeVisual(
      variante
    );

  const tamanho =
    tamanhoExibicao(
      variante.tamanho
    );

  if(visual){
    detalhes.push(
      visual
    );
  }

  if(tamanho){
    detalhes.push(
      tamanho
    );
  }

  return detalhes.join(
    " | "
  );

}


/* =========================================
   BUSCAR PRODUTOS
========================================= */

async function buscarProdutos(){

  const {
    data,
    error
  } =
  await clienteProdutosSali
    .from(
      "Produtos"
    )
    .select("*")
    .eq(
      "ativo",
      true
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );

  if(error){
    throw error;
  }

  return data || [];

}


/* =========================================
   BUSCAR VARIANTES
========================================= */

async function buscarVariantes(
  produtos
){

  if(
    !produtos.length
  ){
    return [];
  }

  const ids =
    produtos.map(
      produto =>
        Number(
          produto.id
        )
    );

  const {
    data,
    error
  } =
  await clienteProdutosSali
    .from(
      "Variantes"
    )
    .select(
      "id,produto_id,cor,tamanho,estampa,estoque,ativo,foto_url"
    )
    .in(
      "produto_id",
      ids
    )
    .eq(
      "ativo",
      true
    )
    .order(
      "id",
      {
        ascending:true
      }
    );

  if(error){

    console.error(
      "Erro ao carregar variantes:",
      error
    );

    /*
      Não derruba a loja inteira
      se ocorrer algum erro nas variantes.
    */

    return [];

  }

  return data || [];

}


/* =========================================
   AGRUPAR VARIANTES POR PRODUTO
========================================= */

function agruparVariantes(
  variantes
){

  const mapa = {};

  variantes.forEach(
    variante => {

      const produtoId =
        String(
          variante.produto_id
        );

      if(
        !mapa[
          produtoId
        ]
      ){

        mapa[
          produtoId
        ] = [];

      }

      mapa[
        produtoId
      ].push(
        variante
      );

    }
  );

  return mapa;

}


/* =========================================
   CRIAR SELECT
========================================= */

function criarCampoSelect(
  titulo
){

  const area =
    document.createElement(
      "div"
    );

  area.className =
    "sali-campo-variante";

  const label =
    document.createElement(
      "label"
    );

  label.textContent =
    titulo;

  const select =
    document.createElement(
      "select"
    );

  area.appendChild(
    label
  );

  area.appendChild(
    select
  );

  return {
    area,
    select
  };

}


/* =========================================
   CARD DO PRODUTO
========================================= */

function criarCardProduto(
  produto,
  variantesProduto
){

  const card =
    document.createElement(
      "div"
    );

  card.className =
    "produto";


  /* FOTO */

  const imagem =
    document.createElement(
      "img"
    );

  imagem.src =
    produto.foto_url ||
    "";

  imagem.alt =
    produto.nome ||
    "Produto SALI";

  imagem.loading =
    "lazy";


  /* INFORMAÇÕES */

  const info =
    document.createElement(
      "div"
    );

  info.className =
    "info";


  /* NOME */

  const nome =
    document.createElement(
      "h3"
    );

  nome.textContent =
    produto.nome ||
    "Produto SALI";


  /* PREÇO */

  const preco =
    document.createElement(
      "div"
    );

  preco.className =
    "preco";

  preco.textContent =
    moedaProduto(
      produto.preco
    );


  info.appendChild(
    nome
  );

  info.appendChild(
    preco
  );


  /* =====================================
     PRODUTO COM VARIANTES
  ===================================== */

  if(
    variantesProduto.length > 0
  ){

    criarInterfaceVariantes(
      produto,
      variantesProduto,
      imagem,
      info
    );

  }else{

    criarBotaoProdutoSimples(
      produto,
      info
    );

  }


  card.appendChild(
    imagem
  );

  card.appendChild(
    info
  );

  return card;

}


/* =========================================
   PRODUTO SEM VARIANTES
========================================= */

function criarBotaoProdutoSimples(
  produto,
  info
){

  const botao =
    document.createElement(
      "button"
    );

  botao.type =
    "button";

  botao.className =
    "adicionar";

  const estoque =
    Number(
      produto.estoque ||
      0
    );

  if(
    estoque <= 0
  ){

    botao.textContent =
      "ESGOTADO";

    botao.disabled =
      true;

  }else{

    botao.textContent =
      "ADICIONAR AO CARRINHO";

    botao.addEventListener(
      "click",
      function(){

        adicionarProduto(
          produto.id,
          produto.nome,
          Number(
            produto.preco
          ),
          produto.foto_url
        );

      }
    );

  }

  info.appendChild(
    botao
  );

}


/* =========================================
   PRODUTO COM VARIANTES
========================================= */

function criarInterfaceVariantes(
  produto,
  variantes,
  imagem,
  info
){

  const bloco =
    document.createElement(
      "div"
    );

  bloco.className =
    "sali-variantes";


  /*
    Consideraremos disponíveis
    somente variantes com estoque > 0.
  */

  const disponiveis =
    variantes.filter(
      variante =>
        Number(
          variante.estoque ||
          0
        ) > 0
    );


  const visuais = [];

  const chavesVisuais =
    new Set();


  variantes.forEach(
    variante => {

      const nome =
        nomeVisual(
          variante
        );

      if(!nome){
        return;
      }

      const chave =
        chaveVisual(
          variante
        );

      if(
        chavesVisuais.has(
          chave
        )
      ){
        return;
      }

      chavesVisuais.add(
        chave
      );

      visuais.push({
        chave,
        nome,
        variante
      });

    }
  );


  const temVisual =
    visuais.length > 0;


  const tamanhosUnicos =
    new Set(
      variantes
      .map(
        variante =>
          textoSeguro(
            variante.tamanho
          )
      )
      .filter(Boolean)
    );


  const temTamanho =
    tamanhosUnicos.size > 0;


  let selectVisual = null;
  let selectTamanho = null;

  let chaveVisualSelecionada =
    null;


  /* =====================================
     COR / ESTAMPA
  ===================================== */

  if(temVisual){

    const campo =
      criarCampoSelect(
        visuais.some(
          item =>
            textoSeguro(
              item.variante.estampa
            )
        )
        ? "Cor / Estampa"
        : "Cor"
      );

    selectVisual =
      campo.select;

    const placeholder =
      document.createElement(
        "option"
      );

    placeholder.value =
      "";

    placeholder.textContent =
      visuais.length > 1
      ? "Selecione"
      : visuais[0].nome;

    if(
      visuais.length > 1
    ){

      placeholder.selected =
        true;

    }

    selectVisual.appendChild(
      placeholder
    );


    visuais.forEach(
      item => {

        if(
          visuais.length === 1
        ){
          return;
        }

        const option =
          document.createElement(
            "option"
          );

        option.value =
          item.chave;

        option.textContent =
          item.nome;

        /*
          Se todas as variantes
          desse visual estão esgotadas,
          mostra como indisponível.
        */

        const possuiEstoque =
          variantes.some(
            variante =>
              chaveVisual(
                variante
              ) ===
              item.chave
              &&
              Number(
                variante.estoque ||
                0
              ) > 0
          );

        if(
          !possuiEstoque
        ){

          option.disabled =
            true;

          option.textContent +=
            " — esgotado";

        }

        selectVisual.appendChild(
          option
        );

      }
    );


    if(
      visuais.length === 1
    ){

      chaveVisualSelecionada =
        visuais[0].chave;

      selectVisual.value =
        "";

      selectVisual.disabled =
        true;

    }


    bloco.appendChild(
      campo.area
    );

  }


  /* =====================================
     TAMANHO
  ===================================== */

  if(temTamanho){

    const campo =
      criarCampoSelect(
        "Tamanho"
      );

    selectTamanho =
      campo.select;

    bloco.appendChild(
      campo.area
    );

  }


  /* STATUS DO ESTOQUE */

  const status =
    document.createElement(
      "div"
    );

  status.className =
    "sali-estoque-variante";


  bloco.appendChild(
    status
  );


  /* BOTÃO */

  const botao =
    document.createElement(
      "button"
    );

  botao.type =
    "button";

  botao.className =
    "adicionar";


  info.appendChild(
    bloco
  );

  info.appendChild(
    botao
  );


  /* =====================================
     VARIANTE SELECIONADA
  ===================================== */

  function obterVariantesFiltradas(){

    let lista =
      [...variantes];

    if(
      temVisual &&
      chaveVisualSelecionada
    ){

      lista =
        lista.filter(
          variante =>
            chaveVisual(
              variante
            ) ===
            chaveVisualSelecionada
        );

    }

    return lista;

  }


  function preencherTamanhos(){

    if(
      !selectTamanho
    ){
      return;
    }

    const valorAnterior =
      selectTamanho.value;

    selectTamanho.innerHTML =
      "";

    const filtradas =
      obterVariantesFiltradas();


    /*
      Se existem várias opções visuais
      e nenhuma foi escolhida ainda,
      pedimos primeiro a cor/estampa.
    */

    if(
      temVisual &&
      visuais.length > 1 &&
      !chaveVisualSelecionada
    ){

      const option =
        document.createElement(
          "option"
        );

      option.value =
        "";

      option.textContent =
        "Escolha primeiro a cor/estampa";

      selectTamanho.appendChild(
        option
      );

      selectTamanho.disabled =
        true;

      return;

    }


    selectTamanho.disabled =
      false;


    const tamanhosMap =
      new Map();


    filtradas.forEach(
      variante => {

        const tamanho =
          textoSeguro(
            variante.tamanho
          );

        if(!tamanho){
          return;
        }

        if(
          !tamanhosMap.has(
            tamanho
          )
        ){

          tamanhosMap.set(
            tamanho,
            variante
          );

        }

      }
    );


    const entradas =
      Array.from(
        tamanhosMap.entries()
      );


    if(
      entradas.length > 1
    ){

      const placeholder =
        document.createElement(
          "option"
        );

      placeholder.value =
        "";

      placeholder.textContent =
        "Selecione o tamanho";

      selectTamanho.appendChild(
        placeholder
      );

    }


    entradas.forEach(
      ([tamanho]) => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          tamanho;

        option.textContent =
          tamanhoExibicao(
            tamanho
          );


        const temEstoque =
          filtradas.some(
            variante =>
              textoSeguro(
                variante.tamanho
              ) ===
              tamanho
              &&
              Number(
                variante.estoque ||
                0
              ) > 0
          );


        if(
          !temEstoque
        ){

          option.disabled =
            true;

          option.textContent +=
            " — esgotado";

        }

        selectTamanho.appendChild(
          option
        );

      }
    );


    /*
      Se existe somente um tamanho,
      seleciona automaticamente.
    */

    if(
      entradas.length === 1
    ){

      selectTamanho.value =
        entradas[0][0];

    }else if(
      valorAnterior &&
      entradas.some(
        entrada =>
          entrada[0] ===
          valorAnterior
      )
    ){

      selectTamanho.value =
        valorAnterior;

    }

  }


  function obterVarianteSelecionada(){

    let lista =
      obterVariantesFiltradas();


    if(
      selectTamanho &&
      selectTamanho.value
    ){

      lista =
        lista.filter(
          variante =>
            textoSeguro(
              variante.tamanho
            ) ===
            selectTamanho.value
        );

    }


    /*
      Se há várias escolhas ainda
      sem seleção, não assume uma.
    */

    if(
      temVisual &&
      visuais.length > 1 &&
      !chaveVisualSelecionada
    ){
      return null;
    }


    if(
      selectTamanho &&
      selectTamanho.options.length > 1 &&
      !selectTamanho.value
    ){
      return null;
    }


    return (
      lista.find(
        variante =>
          Number(
            variante.estoque ||
            0
          ) > 0
      )
      ||
      lista[0]
      ||
      null
    );

  }


  function atualizarInterface(){

    const variante =
      obterVarianteSelecionada();


    /*
      Troca a foto quando escolhe
      cor / estampa.
    */

    if(
      temVisual &&
      chaveVisualSelecionada
    ){

      const varianteFoto =
        variantes.find(
          item =>
            chaveVisual(
              item
            ) ===
            chaveVisualSelecionada
            &&
            item.foto_url
        );

      imagem.src =
        varianteFoto?.foto_url ||
        produto.foto_url ||
        "";

    }else{

      imagem.src =
        produto.foto_url ||
        "";

    }


    if(
      !variante
    ){

      botao.disabled =
        true;

      botao.textContent =
        disponiveis.length
        ? "ESCOLHA AS OPÇÕES"
        : "ESGOTADO";

      status.textContent =
        disponiveis.length
        ? "Selecione as opções disponíveis."
        : "Produto esgotado";

      status.className =
        "sali-estoque-variante " +
        (
          disponiveis.length
          ? ""
          : "esgotado"
        );

      return;

    }


    const estoque =
      Number(
        variante.estoque ||
        0
      );


    if(
      estoque <= 0
    ){

      botao.disabled =
        true;

      botao.textContent =
        "ESGOTADO";

      status.textContent =
        "Esta opção está esgotada";

      status.className =
        "sali-estoque-variante esgotado";

      return;

    }


    botao.disabled =
      false;

    botao.textContent =
      "ADICIONAR AO CARRINHO";

    status.textContent =
      estoque === 1
      ? "Última unidade disponível"
      : `${estoque} unidades disponíveis`;

    status.className =
      "sali-estoque-variante disponivel";

  }


  /* =====================================
     EVENTOS
  ===================================== */

  if(selectVisual){

    selectVisual.addEventListener(
      "change",
      function(){

        chaveVisualSelecionada =
          this.value ||
          (
            visuais.length === 1
            ? visuais[0].chave
            : null
          );

        preencherTamanhos();

        atualizarInterface();

      }
    );

  }


  if(selectTamanho){

    selectTamanho.addEventListener(
      "change",
      atualizarInterface
    );

  }


  botao.addEventListener(
    "click",
    function(){

      const variante =
        obterVarianteSelecionada();

      if(!variante){

        alert(
          "Escolha o tamanho e a cor/estampa antes de adicionar ao carrinho."
        );

        return;

      }


      if(
        Number(
          variante.estoque ||
          0
        ) <= 0
      ){

        alert(
          "Esta opção está esgotada."
        );

        return;

      }


      const detalhes =
        detalhesVariante(
          variante
        );


      const nomeCarrinho =
        detalhes
        ? (
            produto.nome +
            " - " +
            detalhes
          )
        : produto.nome;


      const fotoCarrinho =
        variante.foto_url ||
        produto.foto_url;


      /*
        Usamos produto + variante
        como identificador.

        Assim P e M, por exemplo,
        não viram o mesmo item
        no carrinho.
      */

      const idCarrinho =
        String(
          produto.id
        ) +
        "-v" +
        String(
          variante.id
        );


      adicionarProduto(
        idCarrinho,
        nomeCarrinho,
        Number(
          produto.preco
        ),
        fotoCarrinho
      );

    }
  );


  /* INICIALIZAR */

  if(
    visuais.length === 1
  ){

    chaveVisualSelecionada =
      visuais[0].chave;

  }

  preencherTamanhos();

  atualizarInterface();

}


/* =========================================
   CARREGAR TUDO
========================================= */

async function carregarProdutos(){

  const lista =
    document.getElementById(
      "listaProdutos"
    );

  if(!lista){
    return;
  }


  adicionarEstilosVariantes();


  lista.innerHTML =
    `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:30px;
        color:#777;
      ">
        Carregando produtos...
      </div>
    `;


  let tentativas = 0;


  while(
    !conectarProdutosSali()
    &&
    tentativas < 30
  ){

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          200
        )
    );

    tentativas++;

  }


  if(!clienteProdutosSali){

    console.error(
      "Supabase não carregou."
    );

    lista.innerHTML =
      `
        <div style="
          grid-column:1/-1;
          text-align:center;
          padding:30px;
        ">
          Não foi possível carregar os produtos.
        </div>
      `;

    return;

  }


  try{

    const produtos =
      await buscarProdutos();


    if(
      produtos.length === 0
    ){

      lista.innerHTML =
        `
          <div style="
            grid-column:1/-1;
            text-align:center;
            padding:35px;
            color:#777;
          ">
            Nenhum produto disponível no momento.
          </div>
        `;

      return;

    }


    const variantes =
      await buscarVariantes(
        produtos
      );


    const variantesPorProduto =
      agruparVariantes(
        variantes
      );


    lista.innerHTML =
      "";


    produtos.forEach(
      produto => {

        const variantesProduto =
          variantesPorProduto[
            String(
              produto.id
            )
          ] || [];


        const card =
          criarCardProduto(
            produto,
            variantesProduto
          );


        lista.appendChild(
          card
        );

      }
    );


  }catch(error){

    console.error(
      "Erro ao carregar a loja:",
      error
    );


    lista.innerHTML =
      `
        <div style="
          grid-column:1/-1;
          text-align:center;
          padding:30px;
          color:#b00020;
        ">
          Erro ao carregar os produtos.
        </div>
      `;

  }

}


/* =========================================
   INICIAR
========================================= */

if(
  document.readyState ===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    carregarProdutos
  );

}else{

  carregarProdutos();

}
