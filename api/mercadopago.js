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


    if (!total || Number(total) <= 0) {
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
      crypto.randomUUID();


    const resposta = await fetch(
      "https://api.mercadopago.com/v1/orders",
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

          type: "online",

          total_amount:
            Number(total).toFixed(2),

          external_reference:
            numeroPedido,

          processing_mode:
            "automatic",

          payer: {
            email
          },

          transactions: {

            payments: [
              {

                amount:
                  Number(total).toFixed(2),

                payment_method: {
                  id: "pix",
                  type: "bank_transfer"
                }

              }
            ]

          }

        })

      }
    );


    const dados =
      await resposta.json();


    if (!resposta.ok) {

      console.error(
        "Erro Mercado Pago:",
        dados
      );


      return res.status(
        resposta.status
      ).json({

        error:
          "Erro ao criar pagamento Pix.",

        details:
          dados

      });

    }


    const pagamento =
      dados?.transactions
        ?.payments?.[0] ||
      {};


    return res.status(200).json({

      sucesso: true,

      order_id:
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
        pagamento.qr_code ||
        pagamento.payment_method
          ?.qr_code ||
        null,

      qr_code_base64:
        pagamento.qr_code_base64 ||
        pagamento.payment_method
          ?.qr_code_base64 ||
        null,

      ticket_url:
        pagamento.ticket_url ||
        pagamento.payment_method
          ?.ticket_url ||
        null,

      resposta:
        dados

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
        erro.message

    });

  }

}
