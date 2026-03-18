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
      // DTone uses ISO 3166-1 alpha-3 codes
      const iso2To3 = { 
        HT: 'HTI', IN: 'IND', PH: 'PHL', NG: 'NGA', KE: 'KEN', GH: 'GHA', MX: 'MEX', BR: 'BRA', SN: 'SEN', AO: 'AGO', DO: 'DOM', CL: 'CHL', MA: 'MAR', JM: 'JAM',
        US: 'USA', CA: 'CAN', TZ: 'TZA', UG: 'UGA', ET: 'ETH', RW: 'RWA', CI: 'CIV', ML: 'MLI', BF: 'BFA', CM: 'CMR', BJ: 'BEN', TD: 'TCD', CG: 'COG', GA: 'GAB', ZA: 'ZAF', ZW: 'ZWE', ZM: 'ZMB', BW: 'BWA', NA: 'NAM', MU: 'MUS', TN: 'TUN', DZ: 'DZA', EG: 'EGY', PK: 'PAK', BD: 'BGD', LK: 'LKA', ID: 'IDN', TH: 'THA', VN: 'VNM', MY: 'MYS', SG: 'SGP', SA: 'SAU', AE: 'ARE', QA: 'QAT', KW: 'KWT', BH: 'BHR', OM: 'OMN', TT: 'TTO', BB: 'BRB', HN: 'HND', SV: 'SLV', GT: 'GTM', NI: 'NIC', CR: 'CRI', PA: 'PAN', CO: 'COL', VE: 'VEN', PE: 'PER', EC: 'ECU', BO: 'BOL', AR: 'ARG', PY: 'PRY', UY: 'URY'
      };
      const iso3 = iso2To3[countryIso] || countryIso;
      const res = await fetch(
        `${BASE_URL}/products?country_iso_code=${iso3}&type=FIXED_VALUE_RECHARGE&per_page=100`,
        { headers: { Authorization: auth, Accept: 'application/json' } }
      );
      const data = await res.json();
      console.log('DTone products status:', res.status, 'Country:', countryIso, '->', iso3);
      // Check if the API returned an error
      if (!res.ok || data.error || (data.data && data.data.length === 0 && res.status >= 400)) {
        console.log('DTone products error:', JSON.stringify(data));
        return Response.json({ error: data.error || `No products for ${countryIso}`, products: [] }, { status: res.status || 400 });
      }
      // Return products array
      const products = Array.isArray(data) ? data : (data.data || []);
      return Response.json(products);
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