/* =========================================
   SALI STORE
   PRODUTOS + VARIANTES VISUAIS
   ESTAMPAS COM FOTO + TAMANHOS EM BOTÕES
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
   ESTILOS
========================================= */

function adicionarEstilosSali(){

  if(
    document.getElementById(
      "sali-estilos-produtos"
    )
  ){
    return;
  }

  const style =
    document.createElement("style");

  style.id =
    "sali-estilos-produtos";

  style.textContent = `

    /* BOTÃO DA VITRINE */

    .sali-escolher-opcoes{
      width:100%;
      border:0;
      background:#000;
      color:#fff;
      padding:14px 10px;
      border-radius:12px;
      font-weight:900;
      cursor:pointer;
    }


    /* FUNDO DO MODAL */

    .sali-modal-overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.68);
      display:none;
      align-items:flex-end;
      justify-content:center;
      z-index:99999;
      padding:10px;
    }

    .sali-modal-overlay.ativo{
      display:flex;
    }


    /* JANELA */

    .sali-modal{
      position:relative;
      width:100%;
      max-width:520px;
      max-height:94vh;
      overflow-y:auto;
      background:#fff;
      border-radius:24px 24px 16px 16px;
      padding:16px;
      animation:saliSubir .2s ease;
    }

    @keyframes saliSubir{

      from{
        opacity:0;
        transform:translateY(30px);
      }

      to{
        opacity:1;
        transform:translateY(0);
      }

    }


    /* FECHAR */

    .sali-modal-fechar{
      position:absolute;
      z-index:10;
      top:12px;
      right:12px;
      width:42px;
      height:42px;
      border:0;
      border-radius:50%;
      background:#000;
      color:#fff;
      font-size:26px;
      font-weight:900;
    }


    /* FOTO PRINCIPAL */

    .sali-modal-foto{
      width:100%;
      max-height:490px;
      aspect-ratio:3/4;
      object-fit:cover;
      border-radius:18px;
      background:#eee;
      display:block;
    }


    /* INFO */

    .sali-modal-info{
      padding:15px 2px 3px;
    }

    .sali-modal-info h2{
      font-size:23px;
      line-height:1.15;
      margin:0 0 7px;
    }

    .sali-modal-preco{
      color:#e52d86;
      font-size:25px;
      font-weight:900;
      margin-bottom:20px;
    }


    /* TÍTULOS */

    .sali-titulo-opcao{
      font-size:15px;
      font-weight:900;
      margin-bottom:10px;
    }

    .sali-secao-opcao{
      margin-bottom:20px;
    }


    /* MINIATURAS DAS ESTAMPAS */

    .sali-estampas{
      display:flex;
      gap:10px;
      overflow-x:auto;
      padding:2px 2px 7px;
      scrollbar-width:thin;
    }

    .sali-estampa-botao{
      flex:0 0 76px;
      width:76px;
      height:98px;
      padding:3px;
      border:2px solid #ddd;
      border-radius:13px;
      background:#fff;
      cursor:pointer;
      position:relative;
      transition:.15s;
    }

    .sali-estampa-botao img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
      border-radius:9px;
      background:#eee;
    }

    .sali-estampa-botao.selecionada{
      border:3px solid #e52d86;
      transform:scale(1.03);
    }

    .sali-estampa-botao.selecionada::after{
      content:"✓";
      position:absolute;
      right:-5px;
      top:-7px;
      width:23px;
      height:23px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#e52d86;
      color:#fff;
      font-size:13px;
      font-weight:900;
      border:2px solid #fff;
    }

    .sali-estampa-botao.esgotada{
      opacity:.38;
      cursor:not-allowed;
    }

    .sali-sem-foto-estampa{
      width:100%;
      height:100%;
      background:#f1f1f1;
      border-radius:9px;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      font-size:10px;
      color:#777;
      padding:5px;
    }


    /* TAMANHOS */

    .sali-tamanhos{
      display:flex;
      flex-wrap:wrap;
      gap:9px;
    }

    .sali-tamanho-botao{
      min-width:54px;
      min-height:45px;
      padding:10px 14px;
      border:2px solid #ddd;
      border-radius:11px;
      background:#fff;
      color:#111;
      font-weight:900;
      cursor:pointer;
    }

    .sali-tamanho-botao.unico{
      min-width:100%;
    }

    .sali-tamanho-botao.selecionado{
      border-color:#e52d86;
      background:#fff0f7;
      color:#bd1762;
    }

    .sali-tamanho-botao.esgotado{
      opacity:.35;
      text-decoration:line-through;
      cursor:not-allowed;
    }


    /* STATUS */

    .sali-status-modal{
      margin:5px 0 15px;
      font-size:13px;
      color:#666;
    }

    .sali-status-modal.disponivel{
      color:#258238;
      font-weight:800;
    }

    .sali-status-modal.esgotado{
      color:#c40000;
      font-weight:800;
    }


    /* CARRINHO */

    .sali-modal-adicionar{
      width:100%;
      border:0;
      border-radius:13px;
      background:#000;
      color:#fff;
      padding:17px 12px;
      font-size:16px;
      font-weight:900;
    }

    .sali-modal-adicionar:disabled{
      opacity:.42;
      cursor:not-allowed;
    }


    body.sali-modal-aberto{
      overflow:hidden;
    }

  `;

  document.head.appendChild(style);
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


function tamanhoExibicao(valor){

  const tamanho =
    textoSeguro(valor);

  if(!tamanho){
    return "";
  }

  const normalizado =
    tamanho
    .toLowerCase()
    .replaceAll("ú","u");

  if(
    normalizado.includes("tamanho unico")
    ||
    normalizado.includes("veste 36 ao 42")
  ){

    return "Tamanho único • veste 36 ao 42 ✅";
  }

  return tamanho;
}


function ehTamanhoUnico(valor){

  const texto =
    tamanhoExibicao(valor)
    .toLowerCase();

  return texto.includes(
    "tamanho único"
  );
}


function chaveVisual(variante){

  return (
    textoSeguro(variante.cor)
    +
    "|||"
    +
    textoSeguro(variante.estampa)
  );
}


function nomeVisual(variante){

  const cor =
    textoSeguro(
      variante.cor
    );

  const estampa =
    textoSeguro(
      variante.estampa
    );

  if(cor && estampa){
    return cor + " - " + estampa;
  }

  return estampa || cor || "";
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
    .from("Produtos")
    .select("*")
    .eq("ativo",true)
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

async function buscarVariantes(produtos){

  if(!produtos.length){
    return [];
  }

  const ids =
    produtos.map(
      produto =>
        Number(produto.id)
    );

  const {
    data,
    error
  } =
  await clienteProdutosSali
    .from("Variantes")
    .select(`
      id,
      produto_id,
      cor,
      tamanho,
      estampa,
      estoque,
      ativo,
      foto_url
    `)
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
      "Erro ao buscar variantes:",
      error
    );

    return [];
  }

  return data || [];
}


/* =========================================
   AGRUPAR VARIANTES
========================================= */

function agruparVariantes(variantes){

  const mapa = {};

  variantes.forEach(
    variante => {

      const produtoId =
        String(
          variante.produto_id
        );

      if(!mapa[produtoId]){
        mapa[produtoId] = [];
      }

      mapa[produtoId].push(
        variante
      );
    }
  );

  return mapa;
}


/* =========================================
   MODAL BASE
========================================= */

function garantirModal(){

  if(
    document.getElementById(
      "saliModalOverlay"
    )
  ){
    return;
  }

  const overlay =
    document.createElement("div");

  overlay.id =
    "saliModalOverlay";

  overlay.className =
    "sali-modal-overlay";

  overlay.innerHTML = `

    <div class="sali-modal">

      <button
        type="button"
        class="sali-modal-fechar"
        onclick="fecharModalProduto()"
      >
        ×
      </button>

      <img
        id="saliModalFoto"
        class="sali-modal-foto"
        alt="Produto SALI"
      >

      <div class="sali-modal-info">

        <h2 id="saliModalNome"></h2>

        <div
          id="saliModalPreco"
          class="sali-modal-preco"
        ></div>

        <div
          id="saliAreaEstampas"
          class="sali-secao-opcao"
        ></div>

        <div
          id="saliAreaTamanhos"
          class="sali-secao-opcao"
        ></div>

        <div
          id="saliModalStatus"
          class="sali-status-modal"
        ></div>

        <button
          type="button"
          id="saliModalAdicionar"
          class="sali-modal-adicionar"
        >
          ADICIONAR AO CARRINHO
        </button>

      </div>

    </div>

  `;

  overlay.addEventListener(
    "click",
    function(event){

      if(event.target === overlay){
        fecharModalProduto();
      }
    }
  );

  document.body.appendChild(
    overlay
  );
}


function fecharModalProduto(){

  const overlay =
    document.getElementById(
      "saliModalOverlay"
    );

  if(overlay){

    overlay.classList.remove(
      "ativo"
    );
  }

  document.body.classList.remove(
    "sali-modal-aberto"
  );
}


/* =========================================
   ABRIR PRODUTO COM VARIANTES
========================================= */

function abrirModalProduto(
  produto,
  variantes
){

  garantirModal();

  const overlay =
    document.getElementById(
      "saliModalOverlay"
    );

  const fotoPrincipal =
    document.getElementById(
      "saliModalFoto"
    );

  const nome =
    document.getElementById(
      "saliModalNome"
    );

  const preco =
    document.getElementById(
      "saliModalPreco"
    );

  const areaEstampas =
    document.getElementById(
      "saliAreaEstampas"
    );

  const areaTamanhos =
    document.getElementById(
      "saliAreaTamanhos"
    );

  const status =
    document.getElementById(
      "saliModalStatus"
    );

  const botaoAdicionar =
    document.getElementById(
      "saliModalAdicionar"
    );


  fotoPrincipal.src =
    produto.foto_url || "";

  nome.textContent =
    produto.nome ||
    "Produto SALI";

  preco.textContent =
    moedaProduto(
      produto.preco
    );


  areaEstampas.innerHTML = "";
  areaTamanhos.innerHTML = "";

  status.textContent = "";

  botaoAdicionar.disabled =
    true;


  let visualSelecionado =
    null;

  let tamanhoSelecionado =
    null;


  /* =====================================
     AGRUPAR COR / ESTAMPA
  ===================================== */

  const visuais = [];

  const chavesCriadas =
    new Set();


  variantes.forEach(
    variante => {

      const chave =
        chaveVisual(variante);

      const nome =
        nomeVisual(variante);


      /*
        Se não tiver cor nem estampa,
        não precisamos mostrar miniatura.
      */

      if(!nome){
        return;
      }


      if(
        chavesCriadas.has(chave)
      ){
        return;
      }


      chavesCriadas.add(chave);


      const variantesDoVisual =
        variantes.filter(
          item =>
            chaveVisual(item) ===
            chave
        );


      const foto =
        variantesDoVisual.find(
          item =>
            item.foto_url
        )?.foto_url
        ||
        produto.foto_url
        ||
        "";


      const temEstoque =
        variantesDoVisual.some(
          item =>
            Number(
              item.estoque || 0
            ) > 0
        );


      visuais.push({
        chave,
        nome,
        foto,
        temEstoque
      });

    }
  );


  /* =====================================
     MOSTRAR MINIATURAS
  ===================================== */

  if(visuais.length){

    const titulo =
      document.createElement(
        "div"
      );

    titulo.className =
      "sali-titulo-opcao";

    titulo.textContent =
      visuais.length === 1
      ? "Estampa"
      : "Escolha a estampa";


    const grade =
      document.createElement(
        "div"
      );

    grade.className =
      "sali-estampas";


    visuais.forEach(
      visual => {

        const botao =
          document.createElement(
            "button"
          );

        botao.type =
          "button";

        botao.className =
          "sali-estampa-botao";

        botao.title =
          visual.nome;

        botao.setAttribute(
          "aria-label",
          visual.nome
        );


        if(
          !visual.temEstoque
        ){

          botao.classList.add(
            "esgotada"
          );

          botao.disabled = true;
        }


        if(visual.foto){

          const img =
            document.createElement(
              "img"
            );

          img.src =
            visual.foto;

          img.alt =
            visual.nome;

          botao.appendChild(
            img
          );

        }else{

          const semFoto =
            document.createElement(
              "div"
            );

          semFoto.className =
            "sali-sem-foto-estampa";

          semFoto.textContent =
            "Sem foto";

          botao.appendChild(
            semFoto
          );
        }


        botao.addEventListener(
          "click",
          function(){

            if(
              !visual.temEstoque
            ){
              return;
            }


            visualSelecionado =
              visual.chave;

            tamanhoSelecionado =
              null;


            document
              .querySelectorAll(
                ".sali-estampa-botao"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "selecionada"
                  )
              );


            botao.classList.add(
              "selecionada"
            );


            fotoPrincipal.src =
              visual.foto ||
              produto.foto_url ||
              "";


            renderizarTamanhos();

            atualizarEstado();

          }
        );


        grade.appendChild(
          botao
        );

      }
    );


    areaEstampas.appendChild(
      titulo
    );

    areaEstampas.appendChild(
      grade
    );

  }


  /* =====================================
     FILTRAR VARIANTES
  ===================================== */

  function variantesAtuais(){

    if(
      visuais.length &&
      !visualSelecionado
    ){

      return [];
    }


    if(!visuais.length){

      return [
        ...variantes
      ];
    }


    return variantes.filter(
      variante =>
        chaveVisual(variante) ===
        visualSelecionado
    );
  }


  /* =====================================
     RENDER TAMANHOS
  ===================================== */

  function renderizarTamanhos(){

    areaTamanhos.innerHTML = "";


    if(
      visuais.length &&
      !visualSelecionado
    ){

      return;
    }


    const lista =
      variantesAtuais();


    const tamanhos =
      [];


    lista.forEach(
      variante => {

        const tamanho =
          textoSeguro(
            variante.tamanho
          );


        if(!tamanho){
          return;
        }


        if(
          tamanhos.some(
            item =>
              item.valor === tamanho
          )
        ){
          return;
        }


        const variantesTamanho =
          lista.filter(
            item =>
              textoSeguro(
                item.tamanho
              ) === tamanho
          );


        const temEstoque =
          variantesTamanho.some(
            item =>
              Number(
                item.estoque || 0
              ) > 0
          );


        tamanhos.push({
          valor:tamanho,
          nome:
            tamanhoExibicao(
              tamanho
            ),
          temEstoque
        });

      }
    );


    /*
      Se não existe tamanho,
      não mostra seção.
    */

    if(!tamanhos.length){
      return;
    }


    const titulo =
      document.createElement(
        "div"
      );

    titulo.className =
      "sali-titulo-opcao";

    titulo.textContent =
      "Escolha o tamanho";


    const grade =
      document.createElement(
        "div"
      );

    grade.className =
      "sali-tamanhos";


    tamanhos.forEach(
      tamanho => {

        const botao =
          document.createElement(
            "button"
          );

        botao.type =
          "button";

        botao.className =
          "sali-tamanho-botao";


        if(
          ehTamanhoUnico(
            tamanho.valor
          )
        ){

          botao.classList.add(
            "unico"
          );
        }


        botao.textContent =
          tamanho.nome;


        if(
          !tamanho.temEstoque
        ){

          botao.disabled = true;

          botao.classList.add(
            "esgotado"
          );
        }


        botao.addEventListener(
          "click",
          function(){

            if(
              !tamanho.temEstoque
            ){
              return;
            }


            tamanhoSelecionado =
              tamanho.valor;


            areaTamanhos
              .querySelectorAll(
                ".sali-tamanho-botao"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "selecionado"
                  )
              );


            botao.classList.add(
              "selecionado"
            );


            atualizarEstado();

          }
        );


        grade.appendChild(
          botao
        );

      }
    );


    areaTamanhos.appendChild(
      titulo
    );

    areaTamanhos.appendChild(
      grade
    );


    /*
      Se houver só um tamanho disponível,
      seleciona automaticamente.
    */

    const disponiveis =
      tamanhos.filter(
        tamanho =>
          tamanho.temEstoque
      );


    if(disponiveis.length === 1){

      tamanhoSelecionado =
        disponiveis[0].valor;


      const botaoUnico =
        grade.querySelector(
          ".sali-tamanho-botao:not(.esgotado)"
        );


      if(botaoUnico){

        botaoUnico.classList.add(
          "selecionado"
        );
      }
    }

  }


  /* =====================================
     VARIANTE ESCOLHIDA
  ===================================== */

  function obterVarianteSelecionada(){

    let lista =
      variantesAtuais();


    if(
      visuais.length &&
      !visualSelecionado
    ){
      return null;
    }


    if(tamanhoSelecionado){

      lista =
        lista.filter(
          variante =>
            textoSeguro(
              variante.tamanho
            ) ===
            tamanhoSelecionado
        );
    }


    /*
      Se existem tamanhos e nenhum foi escolhido,
      ainda não está pronto.
    */

    const temTamanhos =
      lista.some(
        variante =>
          textoSeguro(
            variante.tamanho
          )
      );


    if(
      temTamanhos &&
      !tamanhoSelecionado
    ){

      return null;
    }


    return (
      lista.find(
        variante =>
          Number(
            variante.estoque || 0
          ) > 0
      )
      ||
      null
    );
  }


  /* =====================================
     ATUALIZAR STATUS
  ===================================== */

  function atualizarEstado(){

    const variante =
      obterVarianteSelecionada();


    if(!variante){

      botaoAdicionar.disabled =
        true;


      if(
        visuais.length &&
        !visualSelecionado
      ){

        status.textContent =
          "Escolha uma estampa.";

      }else{

        status.textContent =
          "Escolha o tamanho.";
      }


      status.className =
        "sali-status-modal";

      return;
    }


    const estoque =
      Number(
        variante.estoque || 0
      );


    if(estoque <= 0){

      botaoAdicionar.disabled =
        true;

      status.textContent =
        "Esta opção está esgotada.";

      status.className =
        "sali-status-modal esgotado";

      return;
    }


    botaoAdicionar.disabled =
      false;


    status.textContent =
      estoque === 1
      ? "🔥 Última unidade disponível"
      : `✅ ${estoque} unidades disponíveis`;


    status.className =
      "sali-status-modal disponivel";
  }


  /* =====================================
     ADICIONAR AO CARRINHO
  ===================================== */

  botaoAdicionar.onclick =
    function(){

      const variante =
        obterVarianteSelecionada();


      if(!variante){

        alert(
          "Escolha a estampa e o tamanho."
        );

        return;
      }


      const detalhes = [];


      const visual =
        nomeVisual(
          variante
        );


      if(visual){

        detalhes.push(
          visual
        );
      }


      const tamanho =
        tamanhoExibicao(
          variante.tamanho
        );


      if(tamanho){

        detalhes.push(
          tamanho
        );
      }


      const nomeCarrinho =
        detalhes.length
        ? (
            produto.nome +
            " - " +
            detalhes.join(
              " | "
            )
          )
        : produto.nome;


      const fotoCarrinho =
        variante.foto_url
        ||
        fotoPrincipal.src
        ||
        produto.foto_url;


      const idCarrinho =
        String(produto.id)
        +
        "-v"
        +
        String(variante.id);


      adicionarProduto(
        idCarrinho,
        nomeCarrinho,
        Number(
          produto.preco
        ),
        fotoCarrinho
      );


      fecharModalProduto();
    };


  /* =====================================
     SE HOUVER SÓ UMA ESTAMPA
     SELECIONA AUTOMATICAMENTE
  ===================================== */

  const visuaisComEstoque =
    visuais.filter(
      visual =>
        visual.temEstoque
    );


  if(
    visuais.length === 1
    &&
    visuaisComEstoque.length === 1
  ){

    visualSelecionado =
      visuais[0].chave;


    const unicoBotao =
      areaEstampas.querySelector(
        ".sali-estampa-botao"
      );


    if(unicoBotao){

      unicoBotao.classList.add(
        "selecionada"
      );
    }


    fotoPrincipal.src =
      visuais[0].foto
      ||
      produto.foto_url
      ||
      "";
  }


  renderizarTamanhos();

  atualizarEstado();


  overlay.classList.add(
    "ativo"
  );


  document.body.classList.add(
    "sali-modal-aberto"
  );
}


/* =========================================
   CRIAR CARD
========================================= */

function criarCardProduto(
  produto,
  variantes
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


  /* INFO */

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


  /* BOTÃO */

  const botao =
    document.createElement(
      "button"
    );

  botao.type =
    "button";


  if(variantes.length){

    const temEstoque =
      variantes.some(
        variante =>
          Number(
            variante.estoque || 0
          ) > 0
      );


    if(!temEstoque){

      botao.className =
        "adicionar";

      botao.textContent =
        "ESGOTADO";

      botao.disabled = true;

      botao.style.opacity =
        ".5";

    }else{

      botao.className =
        "sali-escolher-opcoes";

      botao.textContent =
        "ESCOLHER OPÇÕES";


      botao.addEventListener(
        "click",
        function(){

          abrirModalProduto(
            produto,
            variantes
          );
        }
      );
    }

  }else{

    botao.className =
      "adicionar";


    const estoque =
      Number(
        produto.estoque ||
        0
      );


    if(estoque <= 0){

      botao.textContent =
        "ESGOTADO";

      botao.disabled =
        true;

      botao.style.opacity =
        ".5";

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
  }


  info.appendChild(nome);
  info.appendChild(preco);
  info.appendChild(botao);

  card.appendChild(imagem);
  card.appendChild(info);

  return card;
}


/* =========================================
   CARREGAR PRODUTOS
========================================= */

async function carregarProdutos(){

  const lista =
    document.getElementById(
      "listaProdutos"
    );

  if(!lista){
    return;
  }


  adicionarEstilosSali();

  garantirModal();


  lista.innerHTML = `
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

    lista.innerHTML = `
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


    if(!produtos.length){

      lista.innerHTML = `
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


    const mapa =
      agruparVariantes(
        variantes
      );


    lista.innerHTML = "";


    produtos.forEach(
      produto => {

        const variantesProduto =
          mapa[
            String(
              produto.id
            )
          ]
          ||
          [];


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
      "Erro ao carregar loja:",
      error
    );


    lista.innerHTML = `
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
