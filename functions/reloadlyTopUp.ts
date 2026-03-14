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

    const authString = `${DTONE_API_KEY}:${DTONE_API_SECRET}`;
    const encoded = new TextEncoder().encode(authString);
    const auth = btoa(String.fromCharCode(...encoded));
    
    const res = await fetch("https://api.dtone.com/topups", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        phone: phoneNumber,
        amount: parseFloat(amount),
        countryCode: countryCode
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
      transactionId: data.id || `tpay-${Date.now()}`,
      data
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});