const BASE_URL = 'https://dvs-api.dtone.com/v1';

function getAuth() {
  const key = Deno.env.get('DTONE_API_KEY');
  const secret = Deno.env.get('DTONE_API_SECRET');
  return 'Basic ' + btoa(`${key}:${secret}`);
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { action } = body;
    const auth = getAuth();

    // Get products for a country
    if (action === 'getProducts') {
      const { countryIso } = body;
      const res = await fetch(
        `${BASE_URL}/products?country_iso_code=${countryIso}&type=FIXED_VALUE_RECHARGE&per_page=100`,
        { headers: { Authorization: auth, Accept: 'application/json' } }
      );
      const data = await res.json();
      console.log('DTone products status:', res.status);
      return Response.json(data);
    }

    // Detect operator via mobile number lookup
    if (action === 'lookupOperator') {
      const { phoneNumber } = body;
      const res = await fetch(`${BASE_URL}/lookup/mobile-number`, {
        method: 'POST',
        headers: { Authorization: auth, Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: phoneNumber })
      });
      const data = await res.json();
      console.log('DTone lookup status:', res.status, JSON.stringify(data).substring(0, 300));
      return Response.json(data);
    }

    // Execute synchronous top-up transaction
    if (action === 'sendTopUp') {
      const { productId, mobileNumber, externalId } = body;
      const payload = {
        product_id: productId,
        auto_confirm: true,
        credit_party_identifier: { mobile_number: mobileNumber },
        external_id: externalId || `TPAY-${Date.now()}`,
      };

      const res = await fetch(`${BASE_URL}/sync/transactions`, {
        method: 'POST',
        headers: { Authorization: auth, Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('DTone transaction status:', res.status, JSON.stringify(data).substring(0, 500));
      return Response.json({ status: res.status, ...data });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('DTone error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});