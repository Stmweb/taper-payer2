import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const CYBRID_CLIENT_ID = Deno.env.get('CYBRID_CLIENT_ID');
const CYBRID_CLIENT_SECRET = Deno.env.get('CYBRID_CLIENT_SECRET');
const CYBRID_BASE = 'https://bank.sandbox.cybrid.app';
const CYBRID_ID_BASE = 'https://id.sandbox.cybrid.app';

async function getBankToken() {
  const res = await fetch(`${CYBRID_ID_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CYBRID_CLIENT_ID,
      client_secret: CYBRID_CLIENT_SECRET,
      scope: 'banks:read banks:write accounts:read accounts:execute customers:read customers:write transfers:read transfers:execute quotes:read quotes:execute',
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token error: ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function cybridApi(token, method, path, body) {
  const res = await fetch(`${CYBRID_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) throw new Error(data?.message || data?.error_message || text);
  return data;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, ...params } = await req.json();
    const token = await getBankToken();

    if (action === 'getBank') {
      const banks = await cybridApi(token, 'GET', '/api/banks');
      return Response.json({ bank: banks.objects?.[0] || null });
    }

    if (action === 'createCustomer') {
      const { name, email } = params;
      const customer = await cybridApi(token, 'POST', '/api/customers', {
        type: 'individual',
        name: { first: name?.split(' ')[0] || 'User', last: name?.split(' ').slice(1).join(' ') || 'Account' },
        email_address: email,
      });
      return Response.json({ customer });
    }

    if (action === 'getOrCreateAccount') {
      const { customerGuid, asset, accountType } = params;
      // List existing accounts for this customer (type: fiat or trading)
      const existing = await cybridApi(token, 'GET', `/api/accounts?customer_guid=${customerGuid}&asset=${asset}&type=${accountType || 'fiat'}`);
      if (existing.objects?.length > 0) {
        return Response.json({ account: existing.objects[0] });
      }
      // Create new account
      const account = await cybridApi(token, 'POST', '/api/accounts', {
        type: accountType || 'fiat',
        customer_guid: customerGuid,
        asset,
      });
      return Response.json({ account });
    }

    if (action === 'getCustomerStatus') {
      const { customerGuid } = params;
      const customer = await cybridApi(token, 'GET', `/api/customers/${customerGuid}`);
      return Response.json({ customer });
    }

    if (action === 'createQuote') {
      const { customerGuid, asset, deliverAmount } = params;
      const quote = await cybridApi(token, 'POST', '/api/quotes', {
        product_type: 'funding',
        customer_guid: customerGuid,
        asset,
        side: 'deposit',
        deliver_amount: Math.round(deliverAmount * 100), // cents
      });
      return Response.json({ quote });
    }

    if (action === 'createTransfer') {
      const { quoteGuid, sourceAccountGuid, destinationAccountGuid } = params;
      const transfer = await cybridApi(token, 'POST', '/api/transfers', {
        quote_guid: quoteGuid,
        transfer_type: 'funding',
        source_account_guid: sourceAccountGuid,
        destination_account_guid: destinationAccountGuid,
      });
      return Response.json({ transfer });
    }

    if (action === 'getTransfer') {
      const { transferGuid } = params;
      const transfer = await cybridApi(token, 'GET', `/api/transfers/${transferGuid}`);
      return Response.json({ transfer });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});