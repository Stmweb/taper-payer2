const CYBRID_CLIENT_ID = Deno.env.get('CYBRID_CLIENT_ID');
const CYBRID_CLIENT_SECRET = Deno.env.get('CYBRID_CLIENT_SECRET');
const CYBRID_BASE = 'https://bank.sandbox.cybrid.app';
const CYBRID_ID_BASE = 'https://id.sandbox.cybrid.app';
const CYBRID_ORG_BASE = 'https://organization.sandbox.cybrid.app';
const CYBRID_BANK_GUID = 'a49147be13c4dbc77b16fbd26470788f';

async function getBankToken() {
  console.log('CLIENT_ID:', CYBRID_CLIENT_ID);
  console.log('CLIENT_SECRET:', CYBRID_CLIENT_SECRET);
  const credentials = btoa(`${CYBRID_CLIENT_ID}:${CYBRID_CLIENT_SECRET}`);
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'customers:read customers:execute accounts:read accounts:execute transfers:read transfers:execute counterparties:read counterparties:execute external_bank_accounts:read external_bank_accounts:execute identity_verifications:read identity_verifications:execute quotes:read quotes:execute workflows:read workflows:execute',
  });
  const res = await fetch(`${CYBRID_ID_BASE}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
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
  if (!res.ok) {
    const errMsg = data?.message || data?.error_message || JSON.stringify(data) || text;
    console.error(`Cybrid API error [${method} ${path}]:`, errMsg);
    throw new Error(errMsg);
  }
  return data;
}

function decodeCustomJwt(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  try {
    const { action, _jwt, ...params } = await req.json();
    const appUser = decodeCustomJwt(_jwt);
    console.log('JWT present:', !!_jwt, '| decoded user:', appUser?.email || 'none');
    if (!appUser) return Response.json({ error: 'You must be logged in to send money. Please log in and try again.' }, { status: 401 });
    const token = await getBankToken();

    // ── Step 2: Create or find customer ──────────────────────────────────────
    if (action === 'createCustomer') {
      const { name, email } = params;

      // Always derive a valid name first
      let cleanName = (name || '').trim();
      if (!cleanName && email) {
        cleanName = email.split('@')[0].replace(/[._\-]/g, ' ');
      }
      if (!cleanName) cleanName = 'User Account';
      const nameParts = cleanName.split(' ').filter(Boolean);
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || 'Account';

      // Check if customer already exists
      const existing = await cybridApi(token, 'GET', `/api/customers?per_page=100`);
      const found = existing.objects?.find(c => c.email_address === email);
      if (found) return Response.json({ customer: found });

      const customer = await cybridApi(token, 'POST', '/api/customers', {
        type: 'individual',
      });
      return Response.json({ customer });
    }

    // ── KYC: Create identity verification & get Persona inquiry ID ───────────
    if (action === 'startKYC') {
      const { customerGuid } = params;

      // Wait for customer to leave 'storing' state (must be 'unverified' before KYC)
      let customerState = 'storing';
      for (let i = 0; i < 15; i++) {
        const c = await cybridApi(token, 'GET', `/api/customers/${customerGuid}`);
        customerState = c.state;
        if (customerState !== 'storing') break;
        await new Promise(r => setTimeout(r, 2000));
      }
      if (customerState === 'storing') throw new Error('Customer still initializing, please try again in a moment.');

      // If already verified, no need to run KYC again
      if (customerState === 'verified' || customerState === 'approved') {
        return Response.json({ state: 'completed', outcome: 'passed', alreadyVerified: true });
      }

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
        asset,
        customer_guid: customerGuid,
        name: `${asset} ${accountType || 'fiat'} account`,
      });
      return Response.json({ account });
    }

    // ── Step 6: Create Plaid workflow to link bank ────────────────────────────
    if (action === 'createPlaidWorkflow') {
      const { customerGuid } = params;
      const workflow = await cybridApi(token, 'POST', '/api/workflows', {
        type: 'plaid',
        kind: 'link_token_create',
        language: 'en',
        link_customization_name: 'default',
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
        asset: 'USD',
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
        receive_amount: amountCents,
      });

      const transfer = await cybridApi(token, 'POST', '/api/transfers', {
        quote_guid: quote.guid,
        transfer_type: 'funding',
        external_bank_account_guid: externalBankAccountGuid,
        payment_rail: 'ach',
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