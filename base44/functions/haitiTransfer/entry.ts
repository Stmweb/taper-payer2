import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BLINDPAY_API_KEY = Deno.env.get('BLINDPAY_API_KEY');
const BLINDPAY_INSTANCE_ID = 'in_xM273RfKTSId';
const BASE = `https://api.blindpay.com/v1/instances/${BLINDPAY_INSTANCE_ID}`;

const bp = (path, opts = {}) => fetch(`${BASE}${path}`, {
  ...opts,
  headers: {
    'Authorization': `Bearer ${BLINDPAY_API_KEY}`,
    'Content-Type': 'application/json',
    ...(opts.headers || {})
  }
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'You must be logged in.' }, { status: 401 });

    const { action, ...params } = await req.json();

    // ── Get exchange rate USD → HTG via Blindpay quote preview ──────────────
    if (action === 'getExchangeRate') {
      const { amountUSD, bank_account_id } = params;
      const amountCents = Math.round(parseFloat(amountUSD) * 100);

      // If bank_account_id provided, get a real quote; otherwise return a live rate estimate
      if (bank_account_id) {
        const res = await bp('/quotes', {
          method: 'POST',
          body: JSON.stringify({
            bank_account_id,
            request_amount: amountCents,
            request_currency: 'USD',
            currency_type: 'sender',
            token: 'USDC',
            network: 'base',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to get quote');
        return Response.json({
          rate: data.exchange_rate || null,
          amountUSD,
          receiveAmount: data.receive_amount,
          receiveCurrency: data.receive_currency,
          quoteId: data.id,
          quoteData: data,
        });
      }

      // Fallback static rate for display only
      const HTG_USD_RATE = 155.5;
      return Response.json({
        rate: HTG_USD_RATE,
        amountUSD,
        haitianAmount: (parseFloat(amountUSD) * HTG_USD_RATE).toFixed(2),
        source: 'estimated_rate',
      });
    }

    // ── List receivers with their bank accounts ──────────────────────────────
    if (action === 'getReceivers') {
      const res = await bp('/receivers');
      const data = await res.json();
      const receivers = data.data || data || [];

      // Fetch bank accounts for each approved receiver in parallel
      const enriched = await Promise.all(
        receivers
          .filter(r => r.kyc_status === 'approved')
          .map(async r => {
            const baRes = await bp(`/receivers/${r.id}/bank-accounts`);
            const baData = await baRes.json();
            return { ...r, bank_accounts: baData.data || baData || [] };
          })
      );
      return Response.json({ receivers: enriched });
    }

    // ── Create a Blindpay payout quote ──────────────────────────────────────
    if (action === 'createPayoutQuote') {
      const { bank_account_id, amountUSD, token = 'USDC', network = 'base' } = params;
      if (!bank_account_id) return Response.json({ error: 'bank_account_id required' }, { status: 400 });

      const amountCents = Math.round(parseFloat(amountUSD) * 100);
      const res = await bp('/quotes', {
        method: 'POST',
        body: JSON.stringify({
          bank_account_id,
          request_amount: amountCents,
          request_currency: 'USD',
          currency_type: 'sender',
          token,
          network,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || JSON.stringify(data));
      return Response.json({ quote: data });
    }

    // ── Execute Blindpay payout (stablecoins → HTG bank/mobile money) ───────
    if (action === 'executePayout') {
      const { quote_id, sender_wallet_address, network = 'base' } = params;
      if (!quote_id) return Response.json({ error: 'quote_id required' }, { status: 400 });

      const res = await bp('/payouts/evm', {
        method: 'POST',
        body: JSON.stringify({ quote_id, sender_wallet_address, network }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || JSON.stringify(data));
      return Response.json({ payout: data });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('haitiTransfer error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});