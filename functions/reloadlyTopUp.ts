const CLIENT_ID = Deno.env.get("RELOADLY_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("RELOADLY_CLIENT_SECRET");

async function getAccessToken() {
  const res = await fetch("https://auth.reloadly.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
      audience: "https://topups.reloadly.com"
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "Auth failed");
  return data.access_token;
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { phoneNumber, amount, countryCode, operatorId, paymentMethod } = body;

    if (!phoneNumber || !amount || !countryCode) {
      return Response.json({ 
        error: "Missing required fields: phoneNumber, amount, countryCode" 
      }, { status: 400 });
    }

    if (!paymentMethod) {
      return Response.json({ 
        error: "Payment method is required" 
      }, { status: 400 });
    }

    const token = await getAccessToken();
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/com.reloadly.topups-v1+json"
    };

    // Send topup request to Reloadly
    const res = await fetch("https://topups.reloadly.com/topups", {
      method: "POST",
      headers,
      body: JSON.stringify({
        operatorId: operatorId || 173,
        amount: parseFloat(amount),
        useLocalAmount: false,
        customIdentifier: `tpay-${Date.now()}`,
        recipientPhone: { countryCode, number: phoneNumber.replace(/^\+?1?/, '') },
        senderPhone: { countryCode: "US", number: "3051234567" }
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
      transactionId: data.id,
      phoneNumber,
      amount: parseFloat(amount),
      countryCode,
      status: "completed",
      paymentMethod
    });
  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});