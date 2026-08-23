const SUPABASE_URL =
  "https://uubslcjoybeehinnwhtg.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_hJ_G5ZdzwAKR_zs7q4luqA_RIa-0Qiz";

let supabaseProdutos = null;

function iniciarSupabaseProdutos() {
  if (
    window.supabase &&
    !supabaseProdutos
  ) {
    supabaseProdutos =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );
  }
}

async function carregarProdutos() {

  const lista =
    document.getElementById(
      "listaProdutos"
    );

  if (!lista) {
    return;
  }

  iniciarSupabaseProdutos();

  if (!supabaseProdutos) {

    lista.innerHTML =
      "<p style='text-align:center;'>Carregando produtos...</p>";

    setTimeout(
      carregarProdutos,
      300
    );

    return;
  }

  lista.innerHTML =
    "<p style='text-align:center;'>Carregando produtos...</p>";

  const { data, error } =
    await supabaseProdutos
      .from("Produtos")
      .select("*")
      .eq("ativo", true)
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(
      "Erro ao carregar produtos:",
      error
    );

    lista.innerHTML =
      "<p style='text-align:center;'>Não foi possível carregar os produtos.</p>";

    return;
  }

  const produtos =
    data || [];

  lista.innerHTML = "";

  if (
    produtos.length === 0
  ) {

    lista.innerHTML =
      "<p style='text-align:center;'>Nenhum produto disponível no momento.</p>";

    return;
  }

  produtos.forEach(
    produto => {

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
        Number(
          produto.preco || 0
        ).toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL"
          }
        );

      const estoque =
        Number(
          produto.estoque || 0
        );

      const botao =
        document.createElement(
          "button"
        );

      botao.type =
        "button";

      botao.className =
        "adicionar";

      if (
        estoque <= 0
      ) {

        botao.textContent =
          "ESGOTADO";

        botao.disabled =
          true;

        botao.style.opacity =
          ".5";

        botao.style.cursor =
          "not-allowed";

      } else {

        botao.textContent =
          "ADICIONAR AO CARRINHO";

        botao.addEventListener(
          "click",
          () => {

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

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    carregarProdutos
  );

} else {

  carregarProdutos();

}
