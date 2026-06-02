import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BLINDPAY_API_KEY = 'UUsDt8oFBahfbCPp16wmMm';
const BLINDPAY_INSTANCE_ID = 'in_xM273RfKTSId';
const BLINDPAY_BASE = `https://api.blindpay.com/v1/instances/${BLINDPAY_INSTANCE_ID}`;

const bpFetch = (path, options = {}) => fetch(`${BLINDPAY_BASE}${path}`, {
  ...options,
  headers: {
    'Authorization': `Bearer ${BLINDPAY_API_KEY}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { endpoint = '/receivers', method = 'GET', body = null } = await req.json();

    const fetchOpts = { method };
    if (body && method !== 'GET') fetchOpts.body = JSON.stringify(body);

    const res = await bpFetch(endpoint, fetchOpts);
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return Response.json({ status: res.status, endpoint, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});