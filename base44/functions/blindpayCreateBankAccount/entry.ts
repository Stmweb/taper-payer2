import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BLINDPAY_API_KEY = 'UUsDt8oFBahfbCPp16wmMm';
const BLINDPAY_INSTANCE_ID = 'in_xM273RfKTSId';
const BASE = `https://api.blindpay.com/v1/instances/${BLINDPAY_INSTANCE_ID}`;

const bp = (path, opts = {}) => fetch(`${BASE}${path}`, {
  ...opts,
  headers: { 'Authorization': `Bearer ${BLINDPAY_API_KEY}`, 'Content-Type': 'application/json', ...(opts.headers || {}) }
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { receiver_id, ...bankData } = await req.json();
    if (!receiver_id) return Response.json({ error: 'receiver_id required' }, { status: 400 });

    // Get bank accounts
    if (req.method === 'GET' || bankData.list) {
      const res = await bp(`/receivers/${receiver_id}/bank-accounts`);
      const data = await res.json();
      return Response.json(data);
    }

    // Create bank account
    const res = await bp(`/receivers/${receiver_id}/bank-accounts`, {
      method: 'POST',
      body: JSON.stringify(bankData),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});