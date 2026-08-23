/* =========================================
   PRODUTOS SALI - CARREGADOS DO SUPABASE
========================================= */

let clienteProdutosSali = null;

/* CONECTAR AO SUPABASE */

function conectarProdutosSali(){

  if(clienteProdutosSali){
    return true;
  }

  /* Se o index.html já criou o cliente */
  if(window.supabaseClient){

    clienteProdutosSali =
      window.supabaseClient;

    return true;
  }

  /* Se a biblioteca já carregou,
     cria um cliente somente para produtos */

  if(window.supabase){

    clienteProdutosSali =
      window.supabase.createClient(
        "https://uubslcjoybeehinnwhtg.supabase.co",
        "sb_publishable_hJ_G5ZdzwAKR_zs7q4luqA_RIa-0Qiz"
      );

    return true;
  }

  return false;
}


/* FORMATAR PREÇO */

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


/* CARREGAR PRODUTOS */

async function carregarProdutos(){

  const lista =
    document.getElementById(
      "listaProdutos"
    );

  if(!lista){
    return;
  }

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

  /* Esperar Supabase carregar */

  let tentativas = 0;

  while(
    !conectarProdutosSali() &&
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


  /* BUSCAR NO BANCO */

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

    console.error(
      "Erro Supabase:",
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

    return;
  }


  const produtos =
    data || [];


  if(produtos.length === 0){

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


  lista.innerHTML = "";


  /* CRIAR OS CARDS */

  produtos.forEach(
    produto => {

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


      /* BOTÃO */

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
          produto.estoque || 0
        );


      if(estoque <= 0){

        botao.textContent =
          "ESGOTADO";

        botao.disabled =
          true;

        botao.style.opacity =
          ".5";

        botao.style.cursor =
          "not-allowed";

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


      lista.appendChild(
        card
      );

    }
  );

}


/* INICIAR */

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
