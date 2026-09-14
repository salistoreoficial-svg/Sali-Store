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

  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

  const supabaseUrl =
    "https://uubslcjoybeehinnwhtg.supabase.co";

  if (!accessToken || !supabaseSecretKey) {
    console.error("Variáveis de ambiente obrigatórias ausentes.");

    return res.status(500).json({
      error: "Configuração do servidor incompleta."
    });
  }

  try {
    /* ========================================
       IDENTIFICAR O PAGAMENTO
    ======================================== */

    const paymentId =
      req.query?.["data.id"] ||
      req.body?.data?.id ||
      req.body?.id ||
      null;

    if (!paymentId) {
      console.log("Webhook recebido sem payment_id:", req.body);

      return res.status(200).json({
        recebido: true
      });
    }

    /* ========================================
       VALIDAR ASSINATURA DO MERCADO PAGO
    ======================================== */

    const xSignature =
      req.headers["x-signature"] || "";

    const xRequestId =
      req.headers["x-request-id"] || "";

    if (webhookSecret && xSignature && xRequestId) {
      const partes =
        String(xSignature).split(",");

      let ts = "";
      let hash = "";

      partes.forEach((parte) => {
        const [chave, valor] =
          parte.split("=");

        if (chave?.trim() === "ts") {
          ts = valor?.trim() || "";
        }

        if (chave?.trim() === "v1") {
          hash = valor?.trim() || "";
        }
      });

      if (ts && hash) {
        const manifesto =
          `id:${String(paymentId).toLowerCase()};` +
          `request-id:${xRequestId};` +
          `ts:${ts};`;

        const assinaturaEsperada =
          crypto
            .createHmac("sha256", webhookSecret)
            .update(manifesto)
            .digest("hex");

        const hashRecebido =
          Buffer.from(hash, "utf8");

        const hashEsperado =
          Buffer.from(assinaturaEsperada, "utf8");

        const assinaturaValida =
          hashRecebido.length === hashEsperado.length &&
          crypto.timingSafeEqual(
            hashRecebido,
            hashEsperado
          );

        if (!assinaturaValida) {
          console.error("Assinatura inválida do webhook.");

          return res.status(401).json({
            error: "Assinatura inválida."
          });
        }
      }
    }

    /* ========================================
       CONSULTAR PAYMENT NO MERCADO PAGO
    ======================================== */

    const respostaPagamento =
      await fetch(
        `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
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

    const pagamento =
      await respostaPagamento.json();

    if (!respostaPagamento.ok) {
      console.error(
        "Erro ao consultar pagamento no Mercado Pago:",
        pagamento
      );

      return res.status(200).json({
        recebido: true
      });
    }

    /* ========================================
       IDENTIFICAR PEDIDO
    ======================================== */

    const numeroPedido =
      pagamento.external_reference ||
      null;

    if (!numeroPedido) {
      console.error(
        "Pagamento sem external_reference:",
        pagamento
      );

      return res.status(200).json({
        recebido: true
      });
    }

    /* ========================================
       CONVERTER STATUS
    ======================================== */

    const statusPagamento =
      String(
        pagamento.status || ""
      ).toLowerCase();

    let novoStatus =
      "Aguardando pagamento";

    if (statusPagamento === "approved") {
      novoStatus = "Confirmado";
    }

    else if (
      statusPagamento === "cancelled" ||
      statusPagamento === "canceled"
    ) {
      novoStatus = "Cancelado";
    }

    else if (statusPagamento === "rejected") {
      novoStatus = "Pagamento recusado";
    }

    else if (
      statusPagamento === "refunded" ||
      statusPagamento === "charged_back"
    ) {
      novoStatus = "Reembolsado";
    }

    console.log("Pagamento recebido:", {
      paymentId,
      numeroPedido,
      statusPagamento,
      novoStatus
    });

    /* ========================================
       ATUALIZAR PEDIDO NO SUPABASE
    ======================================== */

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

          body: JSON.stringify({
            status: novoStatus
          })
        }
      );

    const textoSupabase =
      await respostaSupabase.text();

    let dadosSupabase = [];

    try {
      dadosSupabase =
        textoSupabase
          ? JSON.parse(textoSupabase)
          : [];
    } catch {
      dadosSupabase = [];
    }

    if (!respostaSupabase.ok) {
      console.error(
        "Erro ao atualizar pedido no Supabase:",
        textoSupabase
      );

      return res.status(200).json({
        recebido: true
      });
    }

    if (
      Array.isArray(dadosSupabase) &&
      dadosSupabase.length === 0
    ) {
      console.error(
        `Nenhum pedido encontrado com numero_pedido ${numeroPedido}`
      );

      return res.status(200).json({
        recebido: true
      });
    }

    console.log(
      `Pedido ${numeroPedido} atualizado para ${novoStatus}`
    );

    return res.status(200).json({
      sucesso: true,
      payment_id: paymentId,
      numero_pedido: numeroPedido,
      status_mercado_pago: statusPagamento,
      status_pedido: novoStatus
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
