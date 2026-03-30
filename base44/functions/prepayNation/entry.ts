import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const BASE_URL = 'https://api.prepaynation.com';
const SANDBOX_URL = 'https://sandbox.prepaynation.com';

function getAuthHeader() {
  const username = Deno.env.get('PREPAYNATION_USERNAME');
  const password = Deno.env.get('PREPAYNATION_PASSWORD');
  return 'Basic ' + btoa(`${username}:${password}`);
}

async function callAPI(path, method = 'GET', body = null, useSandbox = true) {
  const baseUrl = useSandbox ? SANDBOX_URL : BASE_URL;
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
    const { action } = payload;

    // GET /balance - Check account balance
    if (action === 'balance') {
      const result = await callAPI('/api/v1/balance');
      return Response.json(result);
    }

    // GET /products - List all products (optionally filter by country)
    if (action === 'products') {
      const { country, type } = payload;
      let path = '/api/v1/products';
      const params = new URLSearchParams();
      if (country) params.set('country', country);
      if (type) params.set('type', type);
      if (params.toString()) path += '?' + params.toString();
      const result = await callAPI(path);
      return Response.json(result);
    }

    // GET /operators - List operators by country
    if (action === 'operators') {
      const { country } = payload;
      const path = country ? `/api/v1/operators?country=${country}` : '/api/v1/operators';
      const result = await callAPI(path);
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
      const result = await callAPI('/api/v1/transaction/topup', 'POST', body);
      return Response.json(result);
    }

    // GET /transaction/:id - Check transaction status
    if (action === 'transaction_status') {
      const { transactionId } = payload;
      const result = await callAPI(`/api/v1/transaction/${transactionId}`);
      return Response.json(result);
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});