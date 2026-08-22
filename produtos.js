const produtos = [
  {
    id: 1,
    nome: "Vestido SALI",
    preco: 49.99,
    imagem: "AB0ECD64-5FFA-4265-92D5-9167066B51FE.png",
    categoria: "Vestidos"
  },
  {
    id: 2,
    nome: "Look SALI",
    preco: 49.99,
    imagem: "1F51613E-DBE2-4D72-83EC-C461362D065D.jpeg",
    categoria: "Conjuntos"
  }
];
function carregarProdutos() {
  const lista = document.getElementById("listaProdutos");

  if (!lista) return;

  lista.innerHTML = "";

  produtos.forEach((produto) => {
    const card = document.createElement("div");
    card.className = "produto";

    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;

    const info = document.createElement("div");
    info.className = "info";

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const preco = document.createElement("div");
    preco.className = "preco";
    preco.textContent = produto.preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    const botao = document.createElement("button");
    botao.className = "adicionar";
    botao.textContent = "ADICIONAR AO CARRINHO";

    botao.addEventListener("click", () => {
      adicionarProduto(
        produto.id,
        produto.nome,
        produto.preco,
        produto.imagem
      );
    });

    info.appendChild(nome);
    info.appendChild(preco);
    info.appendChild(botao);

    card.appendChild(imagem);
    card.appendChild(info);

    lista.appendChild(card);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarProdutos);
} else {
  carregarProdutos();
}
