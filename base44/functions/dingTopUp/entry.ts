import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const DING_API_KEY = Deno.env.get("DING_API_KEY");

const BASE_URL = "https://api.dingconnect.com/api/V1";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action } = body;

    // Detect operator for Haiti (Natcom)
    if (action === "detectOperator") {
      const { phoneNumber } = body;
      // Haiti Natcom always returns this code
      return Response.json({
        id: "00C45BPA",
        name: "Natcom Haiti"
      });
    }

    // Get operators/products for a country
    if (action === "getProducts") {
      const { countryIso } = body;
      const res = await fetch(`${BASE_URL}/GetProducts?countryIso=${countryIso}`, {
        headers: { "api_key": DING_API_KEY, "Content-Type": "application/json" }
      });
      const data = await res.json();
      return Response.json(data);
    }

    // Send top-up
    if (action === "sendTopUp") {
      const { phoneNumber, skuCode, sendingAmount, sendingCurrencyIso } = body;

      const payload = {
        SenderPhoneNumber: "+10000000000",
        RecipientPhoneNumber: phoneNumber,
        SkuCode: skuCode,
        SendingAmount: sendingAmount,
        SendingCurrencyIso: sendingCurrencyIso || "USD",
        DistributorRef: "TPAY-" + Date.now(),
        ValidateOnly: false,
      };

      const res = await fetch(`${BASE_URL}/SendTransfer`, {
        method: "POST",
        headers: { "api_key": DING_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Ding response:", JSON.stringify(data).substring(0, 300));
      return Response.json(data);
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});