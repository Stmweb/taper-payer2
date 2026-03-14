const API_KEY = Deno.env.get("DING_API_KEY");

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { action, phoneNumber, amount, countryCode, skuCode, sendingAmount, sendingCurrencyIso } = body;

    if (!API_KEY) {
      return Response.json({ error: "Missing API credentials" }, { status: 500 });
    }

    const headers = {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    };

    if (action === "sendTopUp") {
      const res = await fetch("https://api.dingconnect.io/topups", {
        method: "POST",
        headers,
        body: JSON.stringify({
          phoneNumber,
          amount,
          countryCode,
          customIdentifier: `tpay-${Date.now()}`
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return Response.json({ error: data.message || "Top-up failed", details: data }, { status: res.status });
      }
      return Response.json({ success: true, transactionId: data.transactionId, data });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});