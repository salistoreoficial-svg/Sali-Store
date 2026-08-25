export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseSecretKey) {
    return res.status(500).json({
      error: "Chave secreta do Supabase não configurada."
    });
  }

  const supabaseUrl =
    "https://uubslcjoybeehinnwhtg.supabase.co";

  try {

    const pedido =
      req.body || {};

    if (
      !pedido.numero_pedido ||
      !pedido.nome_cliente ||
      !pedido.Telefone ||
      !pedido.tipo_entrega ||
      !pedido.forma_pagamento
    ) {
      return res.status(400).json({
        error: "Dados obrigatórios do pedido não informados."
      });
    }

    const resposta =
      await fetch(
        `${supabaseUrl}/rest/v1/Pedidos`,
        {
          method: "POST",

          

          headers: {
  "apikey":
    supabaseSecretKey,

  "Content-Type":
    "application/json",

  "Prefer":
    "return=representation"
},

         

          body:
            JSON.stringify([
              pedido
            ])
        }
      );

    const dados =
      await resposta.json();

    if (!resposta.ok) {

      console.error(
        "Erro Supabase:",
        dados
      );

      return res.status(
        resposta.status
      ).json({
        error:
          "Não foi possível registrar o pedido.",
        details:
          dados
      });
    }

    return res.status(200).json({
      sucesso: true,
      pedido:
        Array.isArray(dados)
        ? dados[0]
        : dados
    });

  } catch (erro) {

    console.error(
      "Erro interno ao salvar pedido:",
      erro
    );

    return res.status(500).json({
      error:
        "Erro interno ao registrar pedido.",
      message:
        erro.message
    });
  }
}
