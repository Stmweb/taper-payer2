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

    const body = await req.json();
    // body: { type, email, first_name, last_name, date_of_birth, address_line_1, city, state_province_region, country, postal_code, phone_number, ... }

    const res = await bp('/receivers', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});