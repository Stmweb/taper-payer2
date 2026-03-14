import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const CLIENT_ID = Deno.env.get("RELOADLY_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("RELOADLY_CLIENT_SECRET");

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing Reloadly credentials");
  }
  
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
  if (!res.ok) {
    console.error("Reloadly auth error:", data);
    throw new Error(data.error_description || `Auth failed: ${res.status}`);
  }
  return data.access_token;
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { action } = body;
    const token = await getAccessToken();
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/com.reloadly.topups-v1+json"
    };

    if (action === "getCountries") {
      const res = await fetch("https://topups.reloadly.com/countries", { headers });
      const data = await res.json();
      return Response.json(data);
    }

    if (action === "getOperators") {
      const { countryIsoCode } = body;
      const res = await fetch(`https://topups.reloadly.com/operators/countries/${countryIsoCode}?suggestedAmountsMap=true&includePin=false`, { headers });
      const data = await res.json();
      return Response.json(data);
    }

    if (action === "sendTopUp") {
      const { operatorId, amount, phoneNumber, countryCode } = body;
      const res = await fetch("https://topups.reloadly.com/topups", {
        method: "POST",
        headers,
        body: JSON.stringify({
          operatorId,
          amount,
          useLocalAmount: false,
          customIdentifier: `tpay-${Date.now()}`,
          recipientPhone: { countryCode, number: phoneNumber },
          senderPhone: { countryCode: "US", number: "3051234567" }
        })
      });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});