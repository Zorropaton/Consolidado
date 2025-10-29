// api/crear-pago-flow.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { montoCLP, descripcion, emailCliente, ordenId } = req.body || {};
    if (!montoCLP || !ordenId) {
      return res.status(400).json({ error: "Falta montoCLP u ordenId" });
    }

    const body = {
      apiKey: process.env.FLOW_API_KEY,   // definirás esto en Vercel
      commerceOrder: ordenId,
      subject: descripcion || "Compra",
      amount: montoCLP,                   // CLP enteros: 15990
      currency: "CLP",
      email: emailCliente || "",
      urlConfirmation: "https://TU-DOMINIO/flow/confirmacion",
      urlReturn: "https://TU-DOMINIO/flow/exito"
    };

    const resp = await fetch("https://www.flow.cl/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(500).json({ error: data });

    // Flow retorna { url, token, ... }
    return res.status(200).json({ urlPago: `${data.url}?token=${data.token}` });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Error interno" });
  }
}