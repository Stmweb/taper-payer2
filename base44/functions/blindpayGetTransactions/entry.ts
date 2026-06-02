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
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const RECEIVER_ID = 're_pAbq0snMKOfL';

    const [payinsRes, payoutsRes, receiversRes, walletsRes, bankAccountsRes] = await Promise.all([
      bp('/payins'),
      bp('/payouts'),
      bp('/receivers'),
      bp(`/receivers/${RECEIVER_ID}/blockchain-wallets`),
      bp(`/receivers/${RECEIVER_ID}/bank-accounts`),
    ]);

    const [payins, payouts, receivers, wallets, bankAccounts] = await Promise.all([
      payinsRes.json(),
      payoutsRes.json(),
      receiversRes.json(),
      walletsRes.json(),
      bankAccountsRes.json(),
    ]);

    return Response.json({ payins, payouts, receivers, wallets, bankAccounts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});