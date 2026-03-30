import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function getAuthHeader() {
  const username = Deno.env.get('PREPAYNATION_USERNAME');
  const password = Deno.env.get('PREPAYNATION_PASSWORD');
  return 'Basic ' + btoa(`${username}:${password}`);
}

async function callAPI(path, method = 'GET', body = null, baseUrl = 'https://sandbox.valuetopup.com/api/v2') {
  const url = `${baseUrl}${path}`;
  
  const options = {
    method,
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(url, options);
  const text = await res.text();
  
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  
  return { status: res.status, ok: res.ok, data };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await req.json();
    const { action, baseUrl: customBaseUrl } = payload;
    const baseUrl = customBaseUrl || 'https://sandbox.valuetopup.com/api/v2';

    // GET /account/balance - Check account balance
    if (action === 'balance') {
      const result = await callAPI('/account/balance', 'GET', null, baseUrl);
      return Response.json(result);
    }

    // GET /catalog/getproducts - Full product catalog
    if (action === 'products') {
      const { country, type } = payload;
      let path = '/catalog/getproducts';
      const params = new URLSearchParams();
      if (country) params.set('country', country);
      if (type) params.set('type', type);
      if (params.toString()) path += '?' + params.toString();
      const result = await callAPI(path, 'GET', null, baseUrl);
      return Response.json(result);
    }

    // GET /catalog/skus - Products assigned to this account
    if (action === 'skus') {
      const { country } = payload;
      let path = '/catalog/skus';
      if (country) path += `?country=${country}`;
      const result = await callAPI(path, 'GET', null, baseUrl);
      return Response.json(result);
    }

    // POST /transaction/topup - Execute a top-up
    if (action === 'topup') {
      const { productId, msisdn, amount, reference } = payload;
      const body = {
        productId,
        msisdn,
        amount,
        reference: reference || `TP-${Date.now()}`,
      };
      const result = await callAPI('/transaction/topup', 'POST', body, baseUrl);
      return Response.json(result);
    }

    // GET /transaction/:id - Check transaction status
    if (action === 'transaction_status') {
      const { transactionId } = payload;
      const result = await callAPI(`/transaction/${transactionId}`, 'GET', null, baseUrl);
      return Response.json(result);
    }

    // Raw path probe — for debugging exact endpoint paths
    if (action === 'probe') {
      const { path, method: probeMethod } = payload;
      const result = await callAPI(path, probeMethod || 'GET', null, baseUrl);
      return Response.json(result);
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});