const DTONE_API_KEY = Deno.env.get("DTONE_API_KEY");
const DTONE_API_SECRET = Deno.env.get("DTONE_API_SECRET");

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { phoneNumber, amount, countryCode } = body;

    if (!phoneNumber || !amount || !countryCode) {
      return Response.json({ 
        error: "Missing required fields: phoneNumber, amount, countryCode" 
      }, { status: 400 });
    }

    if (!DTONE_API_KEY || !DTONE_API_SECRET) {
      return Response.json({ error: "API credentials not configured" }, { status: 500 });
    }

    // Create DTONE request
    const auth = btoa(`${DTONE_API_KEY}:${DTONE_API_SECRET}`);
    const res = await fetch("https://api.dtone.com/coupons/topups", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        destination: { phone: phoneNumber },
        product: { amount, currency: "USD" },
        beneficiary: { countryCode }
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      return Response.json({ 
        success: false, 
        error: data.message || "Transaction failed" 
      }, { status: res.status });
    }

    return Response.json({
      success: true,
      transactionId: data.transactionId || `tpay-${Date.now()}`,
      message: `Top-up processed successfully`,
      data
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});