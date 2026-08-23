/* =========================================
   SALI STORE
   PRODUTOS + VARIANTES + MODAL
========================================= */

const SALI_SUPABASE_URL =
"https://uubslcjoybeehinnwhtg.supabase.co";

const SALI_SUPABASE_KEY =
"sb_publishable_hJ_G5ZdzwAKR_zs7q4luqA_RIa-0Qiz";

let clienteProdutosSali = null;


/* =========================================
   CONEXÃO
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

    .sali-modal-overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.65);
      display:none;
      align-items:flex-end;
      justify-content:center;
      z-index:99999;
      padding:12px;
    }

    .sali-modal-overlay.ativo{
      display:flex;
    }

    .sali-modal{
      width:100%;
      max-width:520px;
      max-height:92vh;
      overflow-y:auto;
      background:#fff;
      border-radius:22px 22px 16px 16px;
      padding:18px;
      position:relative;
      animation:saliSubir .22s ease;
    }

    @keyframes saliSubir{
      from{
        transform:translateY(35px);
        opacity:0;
      }
      to{
        transform:translateY(0);
        opacity:1;
      }
    }

    .sali-modal-fechar{
      position:absolute;
      top:12px;
      right:12px;
      width:40px;
      height:40px;
      border:0;
      border-radius:50%;
      background:#000;
      color:#fff;
      font-size:22px;
      font-weight:900;
      z-index:5;
    }

    .sali-modal-foto{
      width:100%;
      aspect-ratio:3/4;
      object-fit:cover;
      border-radius:16px;
      background:#eee;
      display:block;
    }

    .sali-modal-info{
      padding-top:16px;
    }

    .sali-modal-info h2{
      font-size:23px;
      margin-bottom:7px;
    }

    .sali-modal-preco{
      color:#e52d86;
      font-size:24px;
      font-weight:900;
      margin-bottom:18px;
    }

    .sali-campo-opcao{
      margin-bottom:14px;
    }

    .sali-campo-opcao label{
      display:block;
      font-size:14px;
      font-weight:900;
      margin-bottom:7px;
    }

    .sali-campo-opcao select{
      width:100%;
      padding:13px;
      border:1px solid #ccc;
      border-radius:11px;
      background:#fff;
      font-size:15px;
    }

    .sali-status-modal{
      font-size:13px;
      margin:10px 0 15px;
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

    .sali-modal-adicionar{
      width:100%;
      border:0;
      border-radius:12px;
      background:#000;
      color:#fff;
      padding:16px;
      font-weight:900;
      font-size:16px;
    }

    .sali-modal-adicionar:disabled{
      opacity:.45;
      cursor:not-allowed;
    }

    .sali-escolher-opcoes{
      width:100%;
      border:0;
      background:#000;
      color:#fff;
      padding:14px 10px;
      border-radius:12px;
      font-weight:900;
    }

    body.sali-modal-aberto{
      overflow:hidden;
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


function tamanhoExibicao(valor){

  const tamanho =
    textoSeguro(valor);

  if(!tamanho){
    return "";
  }

  const normalizado =
    tamanho
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

  return tamanho;

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
    return `${cor} • ${estampa}`;
  }

  return estampa || cor || "";

}


function chaveVisual(variante){

  return [
    textoSeguro(
      variante.cor
    ),
    textoSeguro(
      variante.estampa
    )
  ].join("|||");

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


async function buscarVariantes(
  produtos
){

  if(!produtos.length){
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
  .from("Variantes")
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

    console.error(error);

    return [];

  }

  return data || [];

}


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

      if(!mapa[id]){
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

    <div
      class="sali-modal"
      id="saliModal"
    >

      <button
        class="sali-modal-fechar"
        type="button"
        onclick="fecharModalProduto()"
      >
        ×
      </button>

      <img
        class="sali-modal-foto"
        id="saliModalFoto"
        alt="Produto SALI"
      >

      <div class="sali-modal-info">

        <h2
          id="saliModalNome"
        ></h2>

        <div
          class="sali-modal-preco"
          id="saliModalPreco"
        ></div>

        <div
          id="saliModalOpcoes"
        ></div>

        <div
          class="sali-status-modal"
          id="saliModalStatus"
        ></div>

        <button
          type="button"
          class="sali-modal-adicionar"
          id="saliModalAdicionar"
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

  document
  .getElementById(
    "saliModalOverlay"
  )
  ?.classList
  .remove("ativo");

  document.body
  .classList
  .remove(
    "sali-modal-aberto"
  );

}


/* =========================================
   ABRIR VARIANTES
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

  const foto =
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

  const opcoes =
    document.getElementById(
      "saliModalOpcoes"
    );

  const status =
    document.getElementById(
      "saliModalStatus"
    );

  const botao =
    document.getElementById(
      "saliModalAdicionar"
    );


  foto.src =
    produto.foto_url || "";

  nome.textContent =
    produto.nome;

  preco.textContent =
    moedaProduto(
      produto.preco
    );

  opcoes.innerHTML = "";

  status.textContent = "";

  botao.disabled = true;


  const visuais = [];

  const chaves =
    new Set();


  variantes.forEach(
    variante => {

      const visual =
        nomeVisual(
          variante
        );

      if(!visual){
        return;
      }

      const chave =
        chaveVisual(
          variante
        );

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

      visuais.push({
        chave,
        nome:visual
      });

    }
  );


  const tamanhos =
    [
      ...new Set(
        variantes
        .map(
          variante =>
            textoSeguro(
              variante.tamanho
            )
        )
        .filter(Boolean)
      )
    ];


  let selectVisual = null;

  let selectTamanho = null;


  if(visuais.length){

    const campo =
      document.createElement(
        "div"
      );

    campo.className =
      "sali-campo-opcao";

    const label =
      document.createElement(
        "label"
      );

    label.textContent =
      "Cor / Estampa";

    selectVisual =
      document.createElement(
        "select"
      );


    if(visuais.length > 1){

      selectVisual.innerHTML =
        `
          <option value="">
            Selecione
          </option>
        `;

    }


    visuais.forEach(
      item => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          item.chave;

        option.textContent =
          item.nome;

        selectVisual.appendChild(
          option
        );

      }
    );


    if(visuais.length === 1){

      selectVisual.value =
        visuais[0].chave;

    }


    campo.appendChild(
      label
    );

    campo.appendChild(
      selectVisual
    );

    opcoes.appendChild(
      campo
    );

  }


  if(tamanhos.length){

    const campo =
      document.createElement(
        "div"
      );

    campo.className =
      "sali-campo-opcao";

    const label =
      document.createElement(
        "label"
      );

    label.textContent =
      "Tamanho";

    selectTamanho =
      document.createElement(
        "select"
      );

    campo.appendChild(
      label
    );

    campo.appendChild(
      selectTamanho
    );

    opcoes.appendChild(
      campo
    );

  }


  function variantesDoVisual(){

    let lista =
      [...variantes];

    if(
      selectVisual &&
      selectVisual.value
    ){

      lista =
        lista.filter(
          variante =>
            chaveVisual(
              variante
            ) ===
            selectVisual.value
        );

    }

    return lista;

  }


  function preencherTamanhos(){

    if(!selectTamanho){
      return;
    }

    selectTamanho.innerHTML = "";


    if(
      selectVisual &&
      visuais.length > 1 &&
      !selectVisual.value
    ){

      selectTamanho.innerHTML =
        `
          <option value="">
            Escolha primeiro a cor/estampa
          </option>
        `;

      selectTamanho.disabled =
        true;

      return;

    }


    selectTamanho.disabled =
      false;


    const lista =
      variantesDoVisual();


    const unicos =
      [
        ...new Set(
          lista
          .map(
            variante =>
              textoSeguro(
                variante.tamanho
              )
          )
          .filter(Boolean)
        )
      ];


    if(unicos.length > 1){

      selectTamanho.innerHTML =
        `
          <option value="">
            Selecione o tamanho
          </option>
        `;

    }


    unicos.forEach(
      tamanho => {

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
          lista.some(
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


        if(!temEstoque){

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


    if(unicos.length === 1){

      selectTamanho.value =
        unicos[0];

    }

  }


  function varianteSelecionada(){

    let lista =
      variantesDoVisual();


    if(
      selectVisual &&
      visuais.length > 1 &&
      !selectVisual.value
    ){
      return null;
    }


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


  function atualizarModal(){

    const variante =
      varianteSelecionada();


    if(
      selectVisual &&
      selectVisual.value
    ){

      const comFoto =
        variantes.find(
          item =>
            chaveVisual(
              item
            ) ===
            selectVisual.value
            &&
            item.foto_url
        );

      foto.src =
        comFoto?.foto_url ||
        produto.foto_url ||
        "";

    }else{

      foto.src =
        produto.foto_url ||
        "";

    }


    if(!variante){

      status.textContent =
        "Escolha as opções disponíveis.";

      status.className =
        "sali-status-modal";

      botao.disabled =
        true;

      return;

    }


    const estoque =
      Number(
        variante.estoque ||
        0
      );


    if(estoque <= 0){

      status.textContent =
        "Esta opção está esgotada.";

      status.className =
        "sali-status-modal esgotado";

      botao.disabled =
        true;

      return;

    }


    status.textContent =
      estoque === 1
      ? "Última unidade disponível"
      : `${estoque} unidades disponíveis`;

    status.className =
      "sali-status-modal disponivel";

    botao.disabled =
      false;

  }


  if(selectVisual){

    selectVisual.addEventListener(
      "change",
      function(){

        preencherTamanhos();

        atualizarModal();

      }
    );

  }


  if(selectTamanho){

    selectTamanho.addEventListener(
      "change",
      atualizarModal
    );

  }


  botao.onclick =
    function(){

      const variante =
        varianteSelecionada();

      if(!variante){
        return;
      }


      const partes = [];


      const visual =
        nomeVisual(
          variante
        );

      if(visual){
        partes.push(
          visual
        );
      }


      const tamanho =
        tamanhoExibicao(
          variante.tamanho
        );

      if(tamanho){
        partes.push(
          tamanho
        );
      }


      const nomeCarrinho =
        partes.length
        ? (
            produto.nome +
            " - " +
            partes.join(
              " | "
            )
          )
        : produto.nome;


      const idCarrinho =
        `${produto.id}-v${variante.id}`;


      adicionarProduto(
        idCarrinho,
        nomeCarrinho,
        Number(
          produto.preco
        ),
        variante.foto_url ||
        produto.foto_url
      );


      fecharModalProduto();

    };


  preencherTamanhos();

  atualizarModal();


  overlay.classList.add(
    "ativo"
  );

  document.body
  .classList
  .add(
    "sali-modal-aberto"
  );

}


/* =========================================
   CARD
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
    produto.foto_url || "";

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


  const botao =
    document.createElement(
      "button"
    );

  botao.type =
    "button";


  if(variantes.length){

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


  info.appendChild(
    nome
  );

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
   CARREGAR
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


    if(!produtos.length){

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


    const mapa =
      agruparVariantes(
        variantes
      );


    lista.innerHTML = "";


    produtos.forEach(
      produto => {

        const card =
          criarCardProduto(
            produto,
            mapa[
              String(
                produto.id
              )
            ] || []
          );


        lista.appendChild(
          card
        );

      }
    );


  }catch(error){

    console.error(error);


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
