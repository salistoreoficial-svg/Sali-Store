/* =========================================
   SALI STORE
   PRODUTOS + VARIANTES VISUAIS
   FOTO + NOME DA COR / ESTAMPA
========================================= */

const SALI_SUPABASE_URL =
"https://uubslcjoybeehinnwhtg.supabase.co";

const SALI_SUPABASE_KEY =
"sb_publishable_hJ_G5ZdzwAKR_zs7q4luqA_RIa-0Qiz";

let clienteProdutosSali = null;


/* =========================================
   SUPABASE
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
  document.createElement(
    "style"
  );

  style.id =
  "sali-estilos-produtos";

  style.textContent = `

    /* BOTÃO VITRINE */

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


    /* OVERLAY */

    .sali-modal-overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.68);
      display:none;
      align-items:flex-end;
      justify-content:center;
      z-index:99999;
      padding:8px;
    }

    .sali-modal-overlay.ativo{
      display:flex;
    }


    /* MODAL */

    .sali-modal{
      position:relative;
      width:100%;
      max-width:520px;
      max-height:94vh;
      overflow-y:auto;
      -webkit-overflow-scrolling:touch;
      background:#fff;
      border-radius:24px 24px 16px 16px;
      padding:12px;
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
      display:flex;
      align-items:center;
      justify-content:center;
    }


    /* FOTO PRINCIPAL */

    .sali-modal-foto{
      width:100%;
      height:380px;
      object-fit:cover;
      object-position:center;
      border-radius:18px;
      background:#eee;
      display:block;
    }


    /* INFO */

    .sali-modal-info{
      padding:12px 2px 2px;
    }

    .sali-modal-info h2{
      font-size:23px;
      line-height:1.15;
      margin:0 0 5px;
    }

    .sali-modal-preco{
      color:#e52d86;
      font-size:25px;
      font-weight:900;
      margin-bottom:15px;
    }


    /* SEÇÕES */

    .sali-secao-opcao{
      margin-bottom:15px;
    }

    .sali-titulo-opcao{
      font-size:15px;
      font-weight:900;
      margin-bottom:10px;
    }


    /* =====================================
       MINIATURAS COM NOME
    ===================================== */

    .sali-visuais{
      display:flex;
      gap:10px;
      overflow-x:auto;
      padding:3px 3px 8px;
      -webkit-overflow-scrolling:touch;
    }

    .sali-visual-item{
      flex:0 0 76px;
      width:76px;
      border:0;
      background:transparent;
      padding:0;
      cursor:pointer;
    }

    .sali-visual-foto{
      position:relative;
      width:76px;
      height:98px;
      padding:3px;
      border:2px solid #ddd;
      border-radius:13px;
      background:#fff;
      transition:.15s;
    }

    .sali-visual-foto img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
      border-radius:9px;
      background:#eee;
    }

    .sali-visual-nome{
      display:block;
      width:100%;
      margin-top:6px;
      font-size:11px;
      line-height:1.15;
      text-align:center;
      color:#333;
      font-weight:800;
      word-break:break-word;
    }

    .sali-visual-item.selecionada
    .sali-visual-foto{
      border:3px solid #e52d86;
      transform:scale(1.03);
    }

    .sali-visual-item.selecionada
    .sali-visual-foto::after{
      content:"✓";
      position:absolute;
      right:-6px;
      top:-8px;
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

    .sali-visual-item.selecionada
    .sali-visual-nome{
      color:#bd1762;
      font-weight:900;
    }

    .sali-visual-item.esgotada{
      opacity:.38;
      cursor:not-allowed;
    }

    .sali-sem-foto-visual{
      width:100%;
      height:100%;
      border-radius:9px;
      background:#f1f1f1;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      padding:5px;
      color:#777;
      font-size:10px;
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
      width:100%;
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

    .sali-status-modal.alerta{
      color:#b66a00;
      font-weight:800;
    }

    .sali-status-modal.esgotado{
      color:#c40000;
      font-weight:800;
    }


    /* BOTÃO CARRINHO */

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


    /* CELULAR */

    @media(max-width:480px){

      .sali-modal{
        max-height:94vh;
        padding:12px;
      }

      .sali-modal-foto{
        height:280px;
        object-fit:cover;
        object-position:center top;
      }

      .sali-modal-info{
        padding-top:8px;
      }

      .sali-modal-info h2{
        font-size:21px;
        margin-bottom:4px;
      }

      .sali-modal-preco{
        font-size:23px;
        margin-bottom:10px;
      }

      .sali-secao-opcao{
        margin-bottom:12px;
      }

      .sali-visuais{
        gap:9px;
      }

      .sali-visual-item{
        flex:0 0 68px;
        width:68px;
      }

      .sali-visual-foto{
        width:68px;
        height:88px;
      }

      .sali-visual-nome{
        font-size:10px;
        margin-top:5px;
      }

      .sali-tamanho-botao{
        min-height:42px;
        padding:9px 11px;
      }

      .sali-status-modal{
        margin:4px 0 10px;
      }

      .sali-modal-adicionar{
        padding:14px 10px;
      }

    }

  `;

  document.head.appendChild(
    style
  );

}


/* =========================================
   UTILIDADES
========================================= */

function moedaProduto(
  valor
){

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

function textoSeguro(
  valor
){

  return String(
    valor ?? ""
  ).trim();

}

function tamanhoExibicao(
  valor
){

  const tamanho =
  textoSeguro(
    valor
  );

  if(!tamanho){
    return "";
  }

  const normalizado =
  tamanho
  .toLowerCase()
  .replaceAll(
    "ú",
    "u"
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

    return (
      "Tamanho único • veste 36 ao 42 ✅"
    );

  }

  return tamanho;

}

function ehTamanhoUnico(
  valor
){

  return tamanhoExibicao(
    valor
  )
  .toLowerCase()
  .includes(
    "tamanho único"
  );

}

function chaveVisual(
  variante
){

  return (
    textoSeguro(
      variante.cor
    )
    +
    "|||"
    +
    textoSeguro(
      variante.estampa
    )
  );

}

function nomeVisual(
  variante
){

  const estampa =
  textoSeguro(
    variante.estampa
  );

  const cor =
  textoSeguro(
    variante.cor
  );

  /*
    Se for estampa,
    mostra somente Estampa 01 etc.
  */

  if(estampa){
    return estampa;
  }

  /*
    Se for cor,
    mostra Preto, Rosa, Vinho etc.
  */

  if(cor){
    return cor;
  }

  return "";

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
   AGRUPAR
========================================= */

function agruparVariantes(
  variantes
){

  const mapa = {};

  variantes.forEach(
    variante => {

      const id =
      String(
        variante.produto_id
      );

      if(
        !mapa[id]
      ){

        mapa[id] = [];

      }

      mapa[id].push(
        variante
      );

    }
  );

  return mapa;

}


/* =========================================
   MODAL
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
  document.createElement(
    "div"
  );

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

        <h2
          id="saliModalNome"
        ></h2>

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

      if(
        event.target ===
        overlay
      ){

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
   ABRIR MODAL
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

  const areaVisuais =
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
  produto.foto_url ||
  "";

  nome.textContent =
  produto.nome ||
  "Produto SALI";

  preco.textContent =
  moedaProduto(
    produto.preco
  );

  areaVisuais.innerHTML =
  "";

  areaTamanhos.innerHTML =
  "";

  status.textContent =
  "";

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

  const chaves =
  new Set();

  variantes.forEach(
    variante => {

      const chave =
      chaveVisual(
        variante
      );

      const nome =
      nomeVisual(
        variante
      );

      if(!nome){
        return;
      }

      if(
        chaves.has(
          chave
        )
      ){
        return;
      }

      chaves.add(
        chave
      );

      const grupo =
      variantes.filter(
        item =>
          chaveVisual(
            item
          ) === chave
      );

      /*
        A FOTO DA VARIANTE É PRIORIDADE.
      */

      const fotoVariante =
      grupo.find(
        item =>
          textoSeguro(
            item.foto_url
          )
      )?.foto_url ||
      "";

      const temEstoque =
      grupo.some(
        item =>
          Number(
            item.estoque ||
            0
          ) > 0
      );

      visuais.push({

        chave,

        nome,

        foto:
          fotoVariante,

        temEstoque

      });

    }
  );

  /* =====================================
     MOSTRAR MINIATURAS + NOME
  ===================================== */

  if(
    visuais.length
  ){

    const titulo =
    document.createElement(
      "div"
    );

    titulo.className =
    "sali-titulo-opcao";

    const temEstampa =
    variantes.some(
      item =>
        textoSeguro(
          item.estampa
        )
    );

    const temCor =
    variantes.some(
      item =>
        textoSeguro(
          item.cor
        )
    );

    if(
      temEstampa &&
      !temCor
    ){

      titulo.textContent =
      "Escolha a estampa";

    }else if(
      temCor &&
      !temEstampa
    ){

      titulo.textContent =
      "Escolha a cor";

    }else{

      titulo.textContent =
      "Escolha a opção";

    }

    const grade =
    document.createElement(
      "div"
    );

    grade.className =
    "sali-visuais";

    visuais.forEach(
      visual => {

        const botao =
        document.createElement(
          "button"
        );

        botao.type =
        "button";

        botao.className =
        "sali-visual-item";

        botao.title =
        visual.nome;

        if(
          !visual.temEstoque
        ){

          botao.classList.add(
            "esgotada"
          );

          botao.disabled =
          true;

        }

        const caixaFoto =
        document.createElement(
          "div"
        );

        caixaFoto.className =
        "sali-visual-foto";

        if(
          visual.foto
        ){

          const img =
          document.createElement(
            "img"
          );

          img.src =
          visual.foto;

          img.alt =
          visual.nome;

          caixaFoto.appendChild(
            img
          );

        }else{

          const semFoto =
          document.createElement(
            "div"
          );

          semFoto.className =
          "sali-sem-foto-visual";

          semFoto.textContent =
          "Sem foto";

          caixaFoto.appendChild(
            semFoto
          );

        }

        const legenda =
        document.createElement(
          "span"
        );

        legenda.className =
        "sali-visual-nome";

        legenda.textContent =
        visual.nome;

        botao.appendChild(
          caixaFoto
        );

        botao.appendChild(
          legenda
        );

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

            areaVisuais
            .querySelectorAll(
              ".sali-visual-item"
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

            if(
              visual.foto
            ){

              fotoPrincipal.src =
              visual.foto;

            }

            renderizarTamanhos();

            atualizarEstado();

          }
        );

        grade.appendChild(
          botao
        );

      }
    );

    areaVisuais.appendChild(
      titulo
    );

    areaVisuais.appendChild(
      grade
    );

  }

  /* =====================================
     VARIANTES ATUAIS
  ===================================== */

  function variantesAtuais(){

    if(
      visuais.length &&
      !visualSelecionado
    ){

      return [];

    }

    if(
      !visuais.length
    ){

      return [
        ...variantes
      ];

    }

    return variantes.filter(
      variante =>
        chaveVisual(
          variante
        ) ===
        visualSelecionado
    );

  }

  /* =====================================
     TAMANHOS
  ===================================== */

  function renderizarTamanhos(){

    areaTamanhos.innerHTML =
    "";

    if(
      visuais.length &&
      !visualSelecionado
    ){
      return;
    }

    const lista =
    variantesAtuais();

    const tamanhos = [];

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
              item.valor ===
              tamanho
          )
        ){
          return;
        }

        const grupo =
        lista.filter(
          item =>
            textoSeguro(
              item.tamanho
            ) ===
            tamanho
        );

        const temEstoque =
        grupo.some(
          item =>
            Number(
              item.estoque ||
              0
            ) > 0
        );

        tamanhos.push({

          valor:
            tamanho,

          nome:
            tamanhoExibicao(
              tamanho
            ),

          temEstoque

        });

      }
    );

    if(
      !tamanhos.length
    ){
      return;
    }

    const titulo =
    document.createElement(
      "div"
    );

    titulo.className =
    "sali-titulo-opcao";

    titulo.textContent =
    tamanhos.length === 1
    ? "Tamanho"
    : "Escolha o tamanho";

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

          botao.disabled =
          true;

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
      Um único tamanho disponível:
      seleciona automaticamente.
    */

    const disponiveis =
    tamanhos.filter(
      tamanho =>
        tamanho.temEstoque
    );

    if(
      disponiveis.length ===
      1
    ){

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
     VARIANTE SELECIONADA
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

    if(
      tamanhoSelecionado
    ){

      lista =
      lista.filter(
        variante =>
          textoSeguro(
            variante.tamanho
          ) ===
          tamanhoSelecionado
      );

    }

    const possuiTamanho =
    lista.some(
      variante =>
        textoSeguro(
          variante.tamanho
        )
    );

    if(
      possuiTamanho &&
      !tamanhoSelecionado
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
      null
    );

  }

  /* =====================================
     STATUS
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
        "Escolha uma opção.";

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
      variante.estoque ||
      0
    );

    if(
      estoque <= 0
    ){

      botaoAdicionar.disabled =
      true;

      status.textContent =
      "Produto esgotado";

      status.className =
      "sali-status-modal esgotado";

      return;

    }

    botaoAdicionar.disabled =
    false;

    if(
      estoque === 1
    ){

      status.textContent =
      "🔥 Última unidade";

      status.className =
      "sali-status-modal disponivel";

    }else if(
      estoque <= 3
    ){

      status.textContent =
      "⚠️ Poucas unidades disponíveis";

      status.className =
      "sali-status-modal alerta";

    }else{

      status.textContent =
      "✅ Disponível";

      status.className =
      "sali-status-modal disponivel";

    }

  }

  /* =====================================
     CARRINHO
  ===================================== */

  botaoAdicionar.onclick =
  function(){

    const variante =
    obterVarianteSelecionada();

    if(!variante){

      alert(
        "Escolha a opção e o tamanho."
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
    String(
      produto.id
    )
    +
    "-v"
    +
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

    fecharModalProduto();

  };

  /* =====================================
     PRIMEIRA OPÇÃO AUTOMÁTICA
  ===================================== */

  const primeira =
  visuais.find(
    visual =>
      visual.temEstoque
  );

  if(primeira){

    visualSelecionado =
    primeira.chave;

    const botoes =
    areaVisuais
    .querySelectorAll(
      ".sali-visual-item"
    );

    const indice =
    visuais.findIndex(
      visual =>
        visual.chave ===
        primeira.chave
    );

    if(
      botoes[indice]
    ){

      botoes[indice]
      .classList.add(
        "selecionada"
      );

    }

    if(
      primeira.foto
    ){

      fotoPrincipal.src =
      primeira.foto;

    }

  }

  renderizarTamanhos();

  atualizarEstado();

  overlay.classList.add(
    "ativo"
  );

  document.body.classList.add(
    "sali-modal-aberto"
  );

  const modal =
  overlay.querySelector(
    ".sali-modal"
  );

  if(modal){

    modal.scrollTop =
    0;

  }

}

/* =========================================
   BOLINHAS DE COR / ESTAMPA NA VITRINE
========================================= */

function normalizarCorSali(valor){

  return textoSeguro(valor)
  .toLowerCase()
  .normalize("NFD")
  .replace(
    /[\u0300-\u036f]/g,
    ""
  );

}


function codigoCorSali(nome){

  const cor =
  normalizarCorSali(nome);

  const mapa = {

    "preto":"#111111",

    "branco":"#ffffff",

    "off white":"#f6f1e7",

    "bege":"#d7c1a5",

    "nude":"#d7ad95",

    "marrom":"#6e4938",

    "caramelo":"#b97844",

    "rosa":"#e99ab9",

    "pink":"#e52d86",

    "rosa bebe":"#f5c8d9",

    "vermelho":"#c51f32",

    "vinho":"#72243a",

    "azul":"#3867d6",

    "azul bebe":"#a9d7ee",

    "azul marinho":"#182a4d",

    "verde":"#4b8a61",

    "verde militar":"#596044",

    "verde bandeira":"#168447",

    "amarelo":"#f2cf43",

    "laranja":"#e88736",

    "roxo":"#744995",

    "lilas":"#b596cf",

    "cinza":"#9c9c9c",

    "prata":"#c6c8ca",

    "dourado":"#c9a45b"

  };


  return (
    mapa[cor]
    ||
    "#d9d9d9"
  );

}


function criarAmostrasCard(
  variantes,
  imagemProduto
){

  const area =
  document.createElement(
    "div"
  );

  area.className =
  "sali-card-variantes";


  if(
    !variantes ||
    !variantes.length
  ){

    return area;

  }


  const opcoes = [];

  const chaves =
  new Set();


  variantes.forEach(
    variante => {

      /*
        Só mostra opções
        que possuem estoque.
      */

      if(
        Number(
          variante.estoque || 0
        ) <= 0
      ){

        return;

      }


      const cor =
      textoSeguro(
        variante.cor
      );


      const estampa =
      textoSeguro(
        variante.estampa
      );


      if(
        !cor &&
        !estampa
      ){

        return;

      }


      const chave =
      estampa
      ?
      "estampa|" + estampa
      :
      "cor|" + cor;


      if(
        chaves.has(chave)
      ){

        return;

      }


      chaves.add(chave);


      opcoes.push({

        tipo:
        estampa
        ?
        "estampa"
        :
        "cor",

        nome:
        estampa ||
        cor,

        foto:
        textoSeguro(
          variante.foto_url
        )

      });

    }
  );


  /*
    Máximo de 4 bolinhas
    visíveis no card.
  */

  const limite =
  4;


  opcoes
  .slice(
    0,
    limite
  )
  .forEach(
    opcao => {

      const bolinha =
      document.createElement(
        "button"
      );


      bolinha.type =
      "button";


      bolinha.className =
      "sali-card-cor";


      bolinha.title =
      opcao.nome;


      bolinha.setAttribute(
        "aria-label",
        opcao.nome
      );


      if(
        opcao.tipo ===
        "estampa"
      ){

        bolinha.classList.add(
          "estampa"
        );


        if(
          opcao.foto
        ){

          bolinha.style.backgroundImage =
          `url("${opcao.foto}")`;

        }

      }else{

        bolinha.style.background =
        codigoCorSali(
          opcao.nome
        );

      }


      /*
        Ao tocar na bolinha,
        troca a foto do card.
      */

      bolinha.addEventListener(
        "click",
        function(event){

          event.preventDefault();

          event.stopPropagation();


          if(
            opcao.foto &&
            imagemProduto
          ){

            imagemProduto.src =
            opcao.foto;

          }

        }
      );


      area.appendChild(
        bolinha
      );

    }
  );


  if(
    opcoes.length >
    limite
  ){

    const mais =
    document.createElement(
      "span"
    );


    mais.className =
    "sali-card-mais";


    mais.textContent =
    "+" +
    (
      opcoes.length -
      limite
    );


    area.appendChild(
      mais
    );

  }


  return area;

}
/* =========================================
   CARD DO PRODUTO
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

  const info =
  document.createElement(
    "div"
  );

  info.className =
  "info";

  const nome =
  document.createElement(
    "h3"
  );

  nome.textContent =
  produto.nome ||
  "Produto SALI";

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
  const amostras =
  criarAmostrasCard(
    variantes,
    imagem
  );
  const botao =
  document.createElement(
    "button"
  );

  botao.type =
  "button";

  if(
    variantes.length
  ){

    const temEstoque =
    variantes.some(
      variante =>
        Number(
          variante.estoque ||
          0
        ) > 0
    );

    if(
      !temEstoque
    ){

      botao.className =
      "adicionar";

      botao.textContent =
      "ESGOTADO";

      botao.disabled =
      true;

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

    if(
      estoque <= 0
    ){

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

    info.appendChild(
    nome
  );


  if(
    amostras.children.length
  ){

    info.appendChild(
      amostras
    );

  }


  info.appendChild(
    preco
  );

  info.appendChild(
    botao
  );

  card.appendChild(
    imagem
  );

  card.appendChild(
    info
  );

  return card;

}


/* =========================================
   CARREGAR LOJA
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

  if(
    !clienteProdutosSali
  ){

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

    if(
      !produtos.length
    ){

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

    lista.innerHTML =
    "";

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
