export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const accessToken =
    process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({
      error: "Access Token do Mercado Pago não configurado."
    });
  }

  try {

    const {
      total,
      email,
      numeroPedido
    } = req.body || {};

    const valor =
      Number(total);

    if (
      !Number.isFinite(valor) ||
      valor <= 0
    ) {
      return res.status(400).json({
        error: "Valor do pedido inválido."
      });
    }

    if (!email) {
      return res.status(400).json({
        error: "E-mail do cliente é obrigatório."
      });
    }

    if (!numeroPedido) {
      return res.status(400).json({
        error: "Número do pedido não informado."
      });
    }

    const idempotencyKey =
      `${numeroPedido}-${Date.now()}`;

    const resposta =
      await fetch(
        "https://api.mercadopago.com/v1/payments",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${accessToken}`,

            "Content-Type":
              "application/json",

            "Accept":
              "application/json",

            "X-Idempotency-Key":
              idempotencyKey
          },

          body: JSON.stringify({

            transaction_amount:
              valor,

            description:
              `Pedido ${numeroPedido} - SALI STORE`,

            payment_method_id:
              "pix",

            external_reference:
              numeroPedido,

            payer: {
              email: email
            }

          })
        }
      );

    const dados =
      await resposta.json();

    if (!resposta.ok) {

      console.error(
        "Erro Mercado Pago:",
        JSON.stringify(dados)
      );

      return res.status(
        resposta.status || 500
      ).json({

        error:
          dados?.message ||
          dados?.error ||
          "Erro ao criar pagamento Pix.",

        details:
          dados

      });

    }

    const transacao =
      dados?.point_of_interaction
        ?.transaction_data ||
      {};

    const qrCode =
      transacao.qr_code ||
      "";

    const qrCodeBase64 =
      transacao.qr_code_base64 ||
      "";

    const ticketUrl =
      transacao.ticket_url ||
      "";

    if (
      !qrCode &&
      !qrCodeBase64 &&
      !ticketUrl
    ) {

      console.error(
        "Pix criado sem dados de QR Code:",
        JSON.stringify(dados)
      );

      return res.status(500).json({
        error:
          "O Mercado Pago criou o pagamento, mas não retornou os dados do Pix.",
        details:
          dados
      });
    }

    return res.status(200).json({

      sucesso:
        true,

      payment_id:
        dados.id ||
        null,

      status:
        dados.status ||
        null,

      status_detail:
        dados.status_detail ||
        null,

      external_reference:
        dados.external_reference ||
        numeroPedido,

      qr_code:
        qrCode,

      qr_code_base64:
        qrCodeBase64,

      ticket_url:
        ticketUrl

    });

  } catch (erro) {

    console.error(
      "Erro interno Mercado Pago:",
      erro
    );

    return res.status(500).json({

      error:
        "Erro interno ao processar pagamento.",

      message:
        erro?.message ||
        String(erro)

    });

  }

}
