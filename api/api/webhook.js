import crypto from "crypto";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const accessToken =
    process.env.MERCADO_PAGO_ACCESS_TOKEN;

  const webhookSecret =
    process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  const supabaseUrl =
    process.env.SUPABASE_URL;

  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;


  if (
    !accessToken ||
    !webhookSecret ||
    !supabaseUrl ||
    !supabaseSecretKey
  ) {

    console.error(
      "Variáveis de ambiente ausentes."
    );

    return res.status(500).json({
      error: "Configuração do servidor incompleta."
    });

  }


  try {

    /* =========================================
       VALIDAR ASSINATURA DO MERCADO PAGO
    ========================================= */

    const xSignature =
      req.headers["x-signature"] || "";

    const xRequestId =
      req.headers["x-request-id"] || "";

    const dataId =
      req.query?.["data.id"] ||
      req.body?.data?.id ||
      req.body?.id ||
      "";


    const partes =
      String(xSignature)
      .split(",");


    let ts = "";
    let hash = "";


    partes.forEach(parte => {

      const [chave, valor] =
        parte.split("=");

      if (chave?.trim() === "ts") {
        ts = valor?.trim() || "";
      }

      if (chave?.trim() === "v1") {
        hash = valor?.trim() || "";
      }

    });


    if (
      ts &&
      hash &&
      xRequestId &&
      dataId
    ) {

      const manifesto =
        `id:${String(dataId).toLowerCase()};` +
        `request-id:${xRequestId};` +
        `ts:${ts};`;


      const assinaturaEsperada =
        crypto
        .createHmac(
          "sha256",
          webhookSecret
        )
        .update(manifesto)
        .digest("hex");


      const assinaturaValida =
        crypto.timingSafeEqual(
          Buffer.from(hash),
          Buffer.from(assinaturaEsperada)
        );


      if (!assinaturaValida) {

        console.error(
          "Assinatura inválida do webhook."
        );

        return res.status(401).json({
          error: "Assinatura inválida."
        });

      }

    }


    /* =========================================
       IDENTIFICAR ORDER
    ========================================= */

    const orderId =
      req.body?.data?.id ||
      req.body?.id ||
      req.query?.["data.id"] ||
      null;


    if (!orderId) {

      console.log(
        "Webhook recebido sem order id:",
        req.body
      );

      return res.status(200).json({
        recebido: true
      });

    }


    /* =========================================
       CONSULTAR ORDER NO MERCADO PAGO
    ========================================= */

    const respostaOrder =
      await fetch(
        `https://api.mercadopago.com/v1/orders/${encodeURIComponent(orderId)}`,
        {
          method: "GET",

          headers: {
            "Authorization":
              `Bearer ${accessToken}`,

            "Accept":
              "application/json"
          }
        }
      );


    const order =
      await respostaOrder.json();


    if (!respostaOrder.ok) {

      console.error(
        "Erro ao consultar order:",
        order
      );

      return res.status(200).json({
        recebido: true
      });

    }


    const numeroPedido =
      order.external_reference ||
      null;


    if (!numeroPedido) {

      console.error(
        "Order sem external_reference:",
        order
      );

      return res.status(200).json({
        recebido: true
      });

    }


    /* =========================================
       IDENTIFICAR STATUS
    ========================================= */

    const pagamento =
      order?.transactions
        ?.payments?.[0] ||
      {};


    const statusOrder =
      String(
        order.status ||
        ""
      ).toLowerCase();


    const statusPagamento =
      String(
        pagamento.status ||
        ""
      ).toLowerCase();


    const statusDetail =
      String(
        pagamento.status_detail ||
        order.status_detail ||
        ""
      ).toLowerCase();


    let novoStatus =
      "Aguardando pagamento";


    if (
      statusPagamento === "approved" ||
      statusOrder === "processed" ||
      statusOrder === "approved"
    ) {

      novoStatus =
        "Confirmado";

    } else if (
      statusPagamento === "cancelled" ||
      statusPagamento === "canceled" ||
      statusOrder === "cancelled" ||
      statusOrder === "canceled"
    ) {

      novoStatus =
        "Cancelado";

    } else if (
      statusPagamento === "rejected" ||
      statusOrder === "rejected"
    ) {

      novoStatus =
        "Pagamento recusado";

    } else if (
      statusPagamento === "refunded" ||
      statusOrder === "refunded"
    ) {

      novoStatus =
        "Reembolsado";

    }


    console.log(
      "Atualizando pedido:",
      {
        numeroPedido,
        novoStatus,
        statusOrder,
        statusPagamento,
        statusDetail
      }
    );


    /* =========================================
       ATUALIZAR PEDIDO NO SUPABASE
    ========================================= */

    const respostaSupabase =
      await fetch(
        `${supabaseUrl}/rest/v1/Pedidos?numero_pedido=eq.${encodeURIComponent(numeroPedido)}`,
        {
          method: "PATCH",

          headers: {

            "apikey":
              supabaseSecretKey,

            "Authorization":
              `Bearer ${supabaseSecretKey}`,

            "Content-Type":
              "application/json",

            "Prefer":
              "return=representation"

          },

          body:
            JSON.stringify({

              status:
                novoStatus

            })

        }
      );


    const dadosSupabase =
      await respostaSupabase.json();


    if (!respostaSupabase.ok) {

      console.error(
        "Erro ao atualizar Supabase:",
        dadosSupabase
      );

      return res.status(200).json({
        recebido: true
      });

    }


    return res.status(200).json({

      sucesso: true,

      numero_pedido:
        numeroPedido,

      status:
        novoStatus,

      pedido:
        dadosSupabase

    });


  } catch (erro) {

    console.error(
      "Erro interno no webhook:",
      erro
    );


    return res.status(200).json({
      recebido: true
    });

  }

}
