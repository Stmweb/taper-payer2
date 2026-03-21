import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const CYBRID_CLIENT_ID = Deno.env.get('CYBRID_CLIENT_ID');
const CYBRID_CLIENT_SECRET = Deno.env.get('CYBRID_CLIENT_SECRET');
const CYBRID_BASE = 'https://bank.sandbox.cybrid.app';
const CYBRID_ID_BASE = 'https://id.sandbox.cybrid.app';
const CYBRID_BANK_GUID = '5cd17cbb7d655214316d2b278acebd59';

async function getBankToken() {
  console.log('CLIENT_ID length:', CYBRID_CLIENT_ID?.length, '| starts with:', CYBRID_CLIENT_ID?.substring(0, 10));
  console.log('CLIENT_SECRET length:', CYBRID_CLIENT_SECRET?.length);
  const scope = 'customers:read customers:write customers:execute accounts:read accounts:execute quotes:read quotes:execute transfers:read transfers:execute counterparties:read counterparties:write counterparties:execute external_bank_accounts:read external_bank_accounts:write external_bank_accounts:execute workflows:read workflows:execute identity_verifications:read identity_verifications:write identity_verifications:execute';
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CYBRID_CLIENT_ID,
    client_secret: CYBRID_CLIENT_SECRET,
    scope,
  });
  const res = await fetch(`${CYBRID_ID_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const text = await res.text();
  console.log('Token response status:', res.status, '| body:', text.substring(0, 300));
  if (!res.ok) throw new Error(`Token error: ${text}`);
  const data = JSON.parse(text);
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

    // ── Step 2: Create or find customer ──────────────────────────────────────
    if (action === 'createCustomer') {
      const { name, email } = params;
      // Check if customer already exists by listing customers
      const existing = await cybridApi(token, 'GET', `/api/customers?per_page=50`);
      const found = existing.objects?.find(c => c.email_address === email);
      if (found) return Response.json({ customer: found });

      const cleanName = (name || '').trim() || 'User Account';
      const nameParts = cleanName.split(' ').filter(Boolean);
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || 'Account';

      const customer = await cybridApi(token, 'POST', '/api/customers', {
        type: 'individual',
        name: { first: firstName, last: lastName },
        email_address: email,
      });
      return Response.json({ customer });
    }

    // ── KYC: Create identity verification & get Persona inquiry ID ───────────
    if (action === 'startKYC') {
      const { customerGuid } = params;

      // Create identity verification
      const iv = await cybridApi(token, 'POST', '/api/identity_verifications', {
        type: 'kyc',
        method: 'id_and_selfie',
        customer_guid: customerGuid,
        expected_behaviours: ['passed_immediately'], // sandbox: auto-pass
      });

      // Poll up to 10 times for persona_inquiry_id
      let verificationGuid = iv.guid;
      let inquiry = iv;
      for (let i = 0; i < 10; i++) {
        if (inquiry.persona_inquiry_id || inquiry.state === 'completed' || inquiry.outcome === 'passed') break;
        await new Promise(r => setTimeout(r, 1500));
        inquiry = await cybridApi(token, 'GET', `/api/identity_verifications/${verificationGuid}`);
      }

      return Response.json({
        verificationGuid: inquiry.guid,
        personaInquiryId: inquiry.persona_inquiry_id,
        state: inquiry.state,
        outcome: inquiry.outcome,
        personaUrl: inquiry.persona_inquiry_id
          ? `https://withpersona.com/verify?inquiry-id=${inquiry.persona_inquiry_id}`
          : null,
      });
    }

    // ── Step 3: Get customer KYC status ───────────────────────────────────────
    if (action === 'getCustomerStatus') {
      const { customerGuid } = params;
      const customer = await cybridApi(token, 'GET', `/api/customers/${customerGuid}`);
      return Response.json({ customer });
    }

    // ── Step 4 & 5: Get or create fiat/trading account ────────────────────────
    if (action === 'getOrCreateAccount') {
      const { customerGuid, asset, accountType } = params;
      const existing = await cybridApi(token, 'GET', `/api/accounts?customer_guid=${customerGuid}&type=${accountType || 'fiat'}`);
      const match = existing.objects?.find(a => a.asset === asset);
      if (match) return Response.json({ account: match });

      // Poll until customer is verified before creating account
      let customer;
      for (let i = 0; i < 15; i++) {
        customer = await cybridApi(token, 'GET', `/api/customers/${customerGuid}`);
        if (customer.state === 'verified' || customer.state === 'approved') break;
        await new Promise(r => setTimeout(r, 2000));
      }
      if (customer.state !== 'verified' && customer.state !== 'approved') {
        throw new Error(`Customer not yet verified (state: ${customer.state}). Please complete identity verification first.`);
      }

      const account = await cybridApi(token, 'POST', '/api/accounts', {
        type: accountType || 'fiat',
        customer_guid: customerGuid,
        asset,
      });
      return Response.json({ account });
    }

    // ── Step 6: Create Plaid workflow to link bank ────────────────────────────
    if (action === 'createPlaidWorkflow') {
      const { customerGuid } = params;
      const workflow = await cybridApi(token, 'POST', '/api/workflows', {
        type: 'plaid',
        kind: 'link',
        customer_guid: customerGuid,
      });
      return Response.json({ workflow });
    }

    // ── Step 6: Get Plaid workflow (to get link_token) ────────────────────────
    if (action === 'getWorkflow') {
      const { workflowGuid } = params;
      const workflow = await cybridApi(token, 'GET', `/api/workflows/${workflowGuid}`);
      return Response.json({ workflow });
    }

    // ── Step 7: Create external bank account from Plaid token ─────────────────
    if (action === 'createExternalBankAccount') {
      const { customerGuid, plaidPublicToken, accountId } = params;
      const account = await cybridApi(token, 'POST', '/api/external_bank_accounts', {
        name: 'My Bank Account',
        account_kind: 'plaid',
        customer_guid: customerGuid,
        plaid_public_token: plaidPublicToken,
        plaid_account_id: accountId,
      });
      return Response.json({ externalBankAccount: account });
    }

    // ── List external bank accounts ───────────────────────────────────────────
    if (action === 'listExternalBankAccounts') {
      const { customerGuid } = params;
      const result = await cybridApi(token, 'GET', `/api/external_bank_accounts?customer_guid=${customerGuid}`);
      return Response.json({ accounts: result.objects || [] });
    }

    // ── Step 8 & 9: Create counterparty (recipient) ───────────────────────────
    if (action === 'createCounterparty') {
      const { customerGuid, firstName, lastName, country } = params;
      const counterparty = await cybridApi(token, 'POST', '/api/counterparties', {
        type: 'individual',
        customer_guid: customerGuid,
        name: { first: firstName, last: lastName },
        address: { country_code: country === 'Mexico' ? 'MX' : 'NG' },
      });
      return Response.json({ counterparty });
    }

    // ── Step 9: Get counterparty status ──────────────────────────────────────
    if (action === 'getCounterpartyStatus') {
      const { counterpartyGuid } = params;
      const counterparty = await cybridApi(token, 'GET', `/api/counterparties/${counterpartyGuid}`);
      return Response.json({ counterparty });
    }

    // ── Step 10: Add foreign bank account for counterparty ───────────────────
    if (action === 'createCounterpartyExternalBankAccount') {
      const { counterpartyGuid, accountNumber, routingNumber, country } = params;
      const account = await cybridApi(token, 'POST', '/api/external_bank_accounts', {
        name: 'Recipient Bank Account',
        account_kind: 'routing_number',
        counterparty_guid: counterpartyGuid,
        account_details: [
          { account_detail_type: 'routing_number', account_detail_value: routingNumber },
          { account_detail_type: 'account_number', account_detail_value: accountNumber },
        ],
        bank_address: { country_code: country === 'Mexico' ? 'MX' : 'NG' },
      });
      return Response.json({ externalBankAccount: account });
    }

    // ── Step 11: Fund fiat account via ACH (funding quote + transfer) ─────────
    if (action === 'fundViaACH') {
      const { customerGuid, fiatAccountGuid, externalBankAccountGuid, amountUSD } = params;
      const amountCents = Math.round(parseFloat(amountUSD) * 100);

      const quote = await cybridApi(token, 'POST', '/api/quotes', {
        product_type: 'funding',
        customer_guid: customerGuid,
        asset: 'USD',
        side: 'deposit',
        deliver_amount: amountCents,
      });

      const transfer = await cybridApi(token, 'POST', '/api/transfers', {
        quote_guid: quote.guid,
        transfer_type: 'funding',
        external_bank_account_guid: externalBankAccountGuid,
        destination_account_guid: fiatAccountGuid,
      });
      return Response.json({ quote, transfer });
    }

    // ── Step 12: Trade USD → USDC_SOL ────────────────────────────────────────
    if (action === 'tradeUSDtoUSDC') {
      const { customerGuid, fiatAccountGuid, tradingAccountGuid, amountUSD } = params;
      const amountCents = Math.round(parseFloat(amountUSD) * 100);

      const quote = await cybridApi(token, 'POST', '/api/quotes', {
        product_type: 'trading',
        customer_guid: customerGuid,
        symbol: 'USDC_SOL-USD',
        side: 'buy',
        deliver_amount: amountCents,
      });

      const transfer = await cybridApi(token, 'POST', '/api/transfers', {
        quote_guid: quote.guid,
        transfer_type: 'trading',
        source_account_guid: fiatAccountGuid,
        destination_account_guid: tradingAccountGuid,
      });
      return Response.json({ quote, transfer });
    }

    // ── Step 13 & 14: Create + Execute remittance plan ───────────────────────
    if (action === 'executeRemittance') {
      const { customerGuid, tradingAccountGuid, counterpartyExternalBankAccountGuid, amountUSD, country } = params;
      const amountCents = Math.round(parseFloat(amountUSD) * 100);

      const quote = await cybridApi(token, 'POST', '/api/quotes', {
        product_type: 'remittance',
        customer_guid: customerGuid,
        symbol: 'USDC_SOL-USD',
        side: 'remittance',
        deliver_amount: amountCents,
      });

      const remittance = await cybridApi(token, 'POST', '/api/transfers', {
        quote_guid: quote.guid,
        transfer_type: 'remittance',
        source_account_guid: tradingAccountGuid,
        destination_external_bank_account_guid: counterpartyExternalBankAccountGuid,
      });
      return Response.json({ quote, remittance });
    }

    // ── Poll transfer status ──────────────────────────────────────────────────
    if (action === 'getTransfer') {
      const { transferGuid } = params;
      const transfer = await cybridApi(token, 'GET', `/api/transfers/${transferGuid}`);
      return Response.json({ transfer });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('cybridTransfer error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});