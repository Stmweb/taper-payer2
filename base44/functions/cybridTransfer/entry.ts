import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CYBRID_CLIENT_ID = Deno.env.get('CYBRID_CLIENT_ID');
const CYBRID_CLIENT_SECRET = Deno.env.get('CYBRID_CLIENT_SECRET');
const CYBRID_BASE = 'https://bank.sandbox.cybrid.app';
const CYBRID_ID_BASE = 'https://id.sandbox.cybrid.app';
const CYBRID_ORG_BASE = 'https://organization.sandbox.cybrid.app';
const CYBRID_BANK_GUID = 'db3d2566bb70d62919e879e6074eaa0c';

async function getBankToken() {
  console.log('CLIENT_ID:', CYBRID_CLIENT_ID);
  console.log('CLIENT_SECRET:', CYBRID_CLIENT_SECRET);
  const credentials = btoa(`${CYBRID_CLIENT_ID}:${CYBRID_CLIENT_SECRET}`);
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'banks:read customers:read customers:write customers:execute accounts:read accounts:execute transfers:read transfers:execute counterparties:read counterparties:execute external_bank_accounts:read external_bank_accounts:execute identity_verifications:read identity_verifications:execute quotes:read quotes:execute trades:read trades:execute workflows:read workflows:execute',
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
    const base44 = createClientFromRequest(req);
    const { action, _jwt, appUserId, ...params } = await req.json();
    const appUser = decodeCustomJwt(_jwt);
    console.log('JWT present:', !!_jwt, '| decoded user:', appUser?.email || 'none');
    if (!appUser) return Response.json({ error: 'You must be logged in to send money. Please log in and try again.' }, { status: 401 });

    // ── ADMIN: Enable individual_customers feature on the bank ────────────────
    if (action === 'enableIndividualCustomers') {
      const orgClientId = Deno.env.get('CYBRID_ORG_CLIENT_ID');
      const orgClientSecret = Deno.env.get('CYBRID_ORG_CLIENT_SECRET');
      console.log('Org client ID:', orgClientId ? orgClientId.substring(0, 8) + '...' : 'NOT SET');
      const orgCredentials = btoa(`${orgClientId}:${orgClientSecret}`);
      const orgBody = new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'organizations:read banks:read banks:write',
      });
      const orgTokenRes = await fetch(`${CYBRID_ID_BASE}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${orgCredentials}`,
        },
        body: orgBody.toString(),
      });
      const orgTokenText = await orgTokenRes.text();
      console.log('Org token response:', orgTokenRes.status, orgTokenText.substring(0, 300));
      if (!orgTokenRes.ok) throw new Error(`Org token error: ${orgTokenText}`);
      const orgToken = JSON.parse(orgTokenText).access_token;

      // PATCH via bank base URL (org token)
      const patchRes = await fetch(`${CYBRID_BASE}/api/banks/${CYBRID_BANK_GUID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${orgToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: ['kyc_identity_verifications', 'individual_customers', 'business_customers', 'raw_routing_details', 'counterparty_external_accounts', 'individual_customer_raw_routing_details'],
        }),
      });
      const patchText = await patchRes.text();
      console.log('PATCH bank response:', patchRes.status, patchText.substring(0, 600));
      let patchData;
      try { patchData = JSON.parse(patchText); } catch { patchData = { raw: patchText }; }
      if (!patchRes.ok) throw new Error(patchData?.message || patchText);
      return Response.json({ bank: patchData });
    }

    // ── ADMIN: Create a brand-new bank with individual_customers enabled ──────
    if (action === 'createNewBank') {
      const orgClientId = Deno.env.get('CYBRID_ORG_CLIENT_ID');
      const orgClientSecret = Deno.env.get('CYBRID_ORG_CLIENT_SECRET');
      console.log('Org client ID:', orgClientId ? orgClientId.substring(0, 8) + '...' : 'NOT SET');
      const orgCredentials = btoa(`${orgClientId}:${orgClientSecret}`);
      const orgTokenRes = await fetch(`${CYBRID_ID_BASE}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${orgCredentials}`,
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'organizations:read banks:read banks:write banks:execute',
        }).toString(),
      });
      const orgTokenText = await orgTokenRes.text();
      console.log('Org token response:', orgTokenRes.status, orgTokenText.substring(0, 300));
      if (!orgTokenRes.ok) throw new Error(`Org token error: ${orgTokenText}`);
      const orgToken = JSON.parse(orgTokenText).access_token;

      // Create new bank via bank base endpoint (org token required for this)
      const createRes = await fetch(`${CYBRID_BASE}/api/banks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${orgToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'TaperPayer Bank',
          type: 'sandbox',
          supported_trading_symbols: ['USDC-USD', 'USDC_SOL-USD'],
          supported_fiat_account_assets: ['USD'],
          supported_country_codes: ['US'],
          features: ['kyc_identity_verifications', 'individual_customers'],
        }),
      });
      const createText = await createRes.text();
      console.log('Create bank response:', createRes.status, createText.substring(0, 600));
      let createData;
      try { createData = JSON.parse(createText); } catch { createData = { raw: createText }; }
      if (!createRes.ok) throw new Error(createData?.message || createText);
      return Response.json({ bank: createData, newBankGuid: createData.guid });
    }

    // ── Get customer-scoped JWT for Cybrid SDK ────────────────────────────────
    if (action === 'getCustomerToken') {
      const { customerGuid } = params;
      // First get bank token
      const bankToken = await getBankToken();
      // Then call POST /api/customer_tokens on the Identity API
      const res = await fetch(`${CYBRID_ID_BASE}/api/customer_tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bankToken}`,
        },
        body: JSON.stringify({
          customer_guid: customerGuid,
          scopes: [
            'customers:read',
            'customers:write',
            'accounts:read',
            'accounts:execute',
            'identity_verifications:read',
            'identity_verifications:execute',
            'transfers:read',
            'transfers:execute',
          ],
        }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      console.log('getCustomerToken response:', res.status, text.substring(0, 400));
      if (!res.ok) throw new Error(data?.message || data?.error_description || JSON.stringify(data) || text);
      return Response.json({ customerToken: data.access_token });
    }

    const token = await getBankToken();

    // ── Step 2: Create or find customer ──────────────────────────────────────
    if (action === 'createCustomer') {
      const { name, email } = params;

      // Check if this AppUser already has a Cybrid customer ID saved
      if (appUserId) {
        const existing = await base44.asServiceRole.entities.AppUser.get(appUserId);
        if (existing?.cybrid_customer_id) {
          console.log('Reusing existing cybrid_customer_id:', existing.cybrid_customer_id);
          const customer = await cybridApi(token, 'GET', `/api/customers/${existing.cybrid_customer_id}`);
          return Response.json({ customer });
        }
      }

      // Create new customer
      const customer = await cybridApi(token, 'POST', '/api/customers', {
        type: 'individual',
      });

      // Persist the new customer GUID to AppUser
      if (appUserId && customer.guid) {
        await base44.asServiceRole.entities.AppUser.update(appUserId, { cybrid_customer_id: customer.guid });
        console.log('Saved cybrid_customer_id:', customer.guid, 'to AppUser:', appUserId);
      }

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

      // Create identity verification and return immediately (no long polling)
      const iv = await cybridApi(token, 'POST', '/api/identity_verifications', {
        type: 'kyc',
        method: 'id_and_selfie',
        customer_guid: customerGuid,
        expected_behaviours: ['passed_immediately'], // sandbox: auto-pass
      });

      // Wait briefly (3s) for persona_inquiry_id to appear
      let inquiry = iv;
      for (let i = 0; i < 3; i++) {
        if (inquiry.persona_inquiry_id || inquiry.state === 'completed' || inquiry.outcome === 'passed') break;
        await new Promise(r => setTimeout(r, 1000));
        inquiry = await cybridApi(token, 'GET', `/api/identity_verifications/${iv.guid}`);
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

    // ── Create Plaid workflow + poll for link_token ───────────────────────────
    if (action === 'createPlaidWorkflow') {
      const { customerGuid } = params;
      const workflow = await cybridApi(token, 'POST', '/api/workflows', {
        type: 'plaid',
        kind: 'link_token_create',
        language: 'en',
        link_customization_name: 'default',
        customer_guid: customerGuid,
      });

      // Poll until plaid_link_token is available
      let wf = workflow;
      for (let i = 0; i < 15; i++) {
        if (wf.plaid_link_token || wf.state === 'failed') break;
        await new Promise(r => setTimeout(r, 1500));
        wf = await cybridApi(token, 'GET', `/api/workflows/${workflow.guid}`);
      }

      if (wf.state === 'failed') throw new Error(`Plaid workflow failed: ${wf.failure_code}`);
      if (!wf.plaid_link_token) throw new Error('Timed out waiting for Plaid link token.');

      return Response.json({ workflowGuid: wf.guid, plaidLinkToken: wf.plaid_link_token });
    }

    // ── Create external bank account from Plaid public_token ─────────────────
    if (action === 'createExternalBankAccount') {
      const { customerGuid, plaidPublicToken, plaidAccountId } = params;
      const account = await cybridApi(token, 'POST', '/api/external_bank_accounts', {
        name: 'My Bank Account',
        account_kind: 'plaid',
        customer_guid: customerGuid,
        asset: 'USD',
        plaid_public_token: plaidPublicToken,
        plaid_account_id: plaidAccountId,
      });

      // Poll until account leaves 'storing' state
      let eba = account;
      for (let i = 0; i < 20; i++) {
        if (eba.state !== 'storing') break;
        await new Promise(r => setTimeout(r, 2000));
        eba = await cybridApi(token, 'GET', `/api/external_bank_accounts/${account.guid}`);
        console.log(`createExternalBankAccount state [attempt ${i+1}]:`, eba.state);
      }

      return Response.json({ externalBankAccount: eba });
    }

    // ── List external bank accounts ───────────────────────────────────────────
    if (action === 'listExternalBankAccounts') {
      const { customerGuid } = params;
      const result = await cybridApi(token, 'GET', `/api/external_bank_accounts?customer_guid=${customerGuid}`);
      return Response.json({ accounts: result.objects || [] });
    }

    // ── Verify external bank account ownership ───────────────────────────────
    if (action === 'verifyExternalBankAccount') {
      const { customerGuid, externalBankAccountGuid } = params;
      const iv = await cybridApi(token, 'POST', '/api/identity_verifications', {
        type: 'bank_account',
        method: 'account_ownership',
        customer_guid: customerGuid,
        external_bank_account_guid: externalBankAccountGuid,
      });
      // Poll until completed
      let result = iv;
      for (let i = 0; i < 15; i++) {
        if (result.state === 'completed' || result.state === 'failed' || result.state === 'expired') break;
        await new Promise(r => setTimeout(r, 2000));
        result = await cybridApi(token, 'GET', `/api/identity_verifications/${iv.guid}`);
      }
      return Response.json({ verification: result });
    }

    // ── Step 8 & 9: Create counterparty (recipient) + verify via watchlists ──
    if (action === 'createCounterparty') {
      const { customerGuid, firstName, lastName, country } = params;
      const { city, state, postalCode, street } = params;

      // Map country name to ISO code
      const countryCodeMap = { 'Mexico': 'MX', 'Nigeria': 'NG', 'Haiti': 'HT', 'Kenya': 'KE', 'Ghana': 'GH', 'Senegal': 'SN' };
      const countryCode = countryCodeMap[country] || 'US';

      const addressObj = {
        country_code: countryCode,
        city: city || 'N/A',
        street: street || '1 Main Street',
        ...(state ? { subdivision: state } : {}),
      };

      // Only add postal_code for countries that require it (Ghana doesn't use postal codes)
      if (countryCode !== 'GH') {
        addressObj.postal_code = postalCode || (countryCode === 'HT' ? '1234' : countryCode === 'NG' ? '100001' : '00000');
      }

      const counterparty = await cybridApi(token, 'POST', '/api/counterparties', {
        type: 'individual',
        customer_guid: customerGuid,
        name: { first: firstName, last: lastName },
        address: addressObj,
      });

      const cpGuid = counterparty.guid;

      // Wait for counterparty to leave 'storing' state
      let cpState = counterparty.state;
      for (let i = 0; i < 10; i++) {
        if (cpState !== 'storing') break;
        await new Promise(r => setTimeout(r, 1500));
        const cp = await cybridApi(token, 'GET', `/api/counterparties/${cpGuid}`);
        cpState = cp.state;
      }

      // Run watchlist verification (sandbox: auto-pass with expected_behaviours)
      const iv = await cybridApi(token, 'POST', '/api/identity_verifications', {
        type: 'counterparty',
        method: 'watchlists',
        counterparty_guid: cpGuid,
        expected_behaviours: ['passed_immediately'],
      });

      // Poll until completed
      let ivResult = iv;
      for (let i = 0; i < 15; i++) {
        if (ivResult.state === 'completed' || ivResult.state === 'expired') break;
        await new Promise(r => setTimeout(r, 1500));
        ivResult = await cybridApi(token, 'GET', `/api/identity_verifications/${iv.guid}`);
      }

      // Get updated counterparty state
      const updatedCp = await cybridApi(token, 'GET', `/api/counterparties/${cpGuid}`);
      if (updatedCp.state !== 'verified') {
        throw new Error(`Counterparty verification failed (state: ${updatedCp.state}, outcome: ${ivResult.outcome})`);
      }

      return Response.json({ counterparty: updatedCp });
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
      console.log('createCounterpartyExternalBankAccount params:', { counterpartyGuid, accountNumber, routingNumber, country });
      const intlCountries = ['Ghana', 'Kenya', 'Senegal', 'Dominican Republic', 'Haiti'];
      const routingType = country === 'Canada' ? 'CPA' : intlCountries.includes(country) ? 'SWIFT' : 'ABA';
      const account = await cybridApi(token, 'POST', '/api/external_bank_accounts', {
        name: 'Recipient Bank Account',
        account_kind: 'raw_routing_details',
        counterparty_guid: counterpartyGuid,
        asset: 'USD',
        counterparty_bank_account: {
          routing_number_type: routingType,
          routing_number: routingNumber,
          account_number: accountNumber,
        },
      });
      return Response.json({ externalBankAccount: account });
    }

    // ── Link sender's own bank account via raw routing details ───────────────
    if (action === 'linkSenderBankAccount') {
      const { customerGuid, accountNumber, routingNumber, ownerName, ownerCity, ownerState } = params;

      // Fetch customer to get name if not provided
      let nameToUse = ownerName || 'Account Owner';
      const nameParts = nameToUse.trim().split(' ');
      const firstName = nameParts[0] || 'Account';
      const lastName = nameParts.slice(1).join(' ') || 'Owner';

      const account = await cybridApi(token, 'POST', '/api/external_bank_accounts', {
        name: 'My Bank Account',
        account_kind: 'raw_routing_details',
        customer_guid: customerGuid,
        asset: 'USD',
        counterparty_name: { first: firstName, last: lastName },
        counterparty_address: {
          street: '1 Main Street',
          city: ownerCity || 'New York',
          subdivision: ownerState || 'NY',
          postal_code: '10001',
          country_code: 'US',
        },
        counterparty_bank_account: {
          routing_number_type: 'ABA',
          routing_number: routingNumber,
          account_number: accountNumber,
        },
      });

      // Poll until account leaves 'storing' state
      let eba = account;
      for (let i = 0; i < 15; i++) {
        if (eba.state !== 'storing') break;
        await new Promise(r => setTimeout(r, 2000));
        eba = await cybridApi(token, 'GET', `/api/external_bank_accounts/${account.guid}`);
        console.log(`linkSenderBankAccount state [attempt ${i+1}]:`, eba.state);
      }

      // Run ownership verification (sandbox: auto-pass)
      if (eba.state === 'unverified') {
        console.log('Running bank account ownership verification...');
        const iv = await cybridApi(token, 'POST', '/api/identity_verifications', {
          type: 'bank_account',
          method: 'account_ownership',
          customer_guid: customerGuid,
          external_bank_account_guid: eba.guid,
          expected_behaviours: ['passed_immediately'],
        });
        // Poll until verification completes
        let ivResult = iv;
        for (let i = 0; i < 15; i++) {
          if (ivResult.state === 'completed' || ivResult.state === 'failed' || ivResult.state === 'expired') break;
          await new Promise(r => setTimeout(r, 2000));
          ivResult = await cybridApi(token, 'GET', `/api/identity_verifications/${iv.guid}`);
          console.log(`Ownership verification state [attempt ${i+1}]:`, ivResult.state, ivResult.outcome);
        }
        // Re-fetch account after verification
        eba = await cybridApi(token, 'GET', `/api/external_bank_accounts/${account.guid}`);
        console.log('Final bank account state after verification:', eba.state);
      }

      return Response.json({ externalBankAccount: eba });
    }

    // ── Step 11: Fund fiat account via ACH (funding quote + transfer) ─────────
    if (action === 'fundViaACH') {
      const { customerGuid, fiatAccountGuid, externalBankAccountGuid, amountUSD } = params;
      const amountCents = Math.round(parseFloat(amountUSD) * 100);

      // Wait for external bank account to leave 'storing' state
      let eba;
      for (let i = 0; i < 15; i++) {
        eba = await cybridApi(token, 'GET', `/api/external_bank_accounts/${externalBankAccountGuid}`);
        console.log(`External bank account state [attempt ${i+1}]:`, eba.state);
        if (eba.state !== 'storing') break;
        await new Promise(r => setTimeout(r, 2000));
      }

      // If still unverified, auto-run ownership verification
      if (eba.state === 'unverified') {
        console.log('Account unverified, running ownership verification...');
        const iv = await cybridApi(token, 'POST', '/api/identity_verifications', {
          type: 'bank_account',
          method: 'account_ownership',
          customer_guid: customerGuid,
          external_bank_account_guid: eba.guid,
          expected_behaviours: ['passed_immediately'],
        });
        let ivResult = iv;
        for (let i = 0; i < 15; i++) {
          if (ivResult.state === 'completed' || ivResult.state === 'failed' || ivResult.state === 'expired') break;
          await new Promise(r => setTimeout(r, 2000));
          ivResult = await cybridApi(token, 'GET', `/api/identity_verifications/${iv.guid}`);
          console.log(`Ownership verification [attempt ${i+1}]:`, ivResult.state, ivResult.outcome);
        }
        eba = await cybridApi(token, 'GET', `/api/external_bank_accounts/${externalBankAccountGuid}`);
        console.log('Bank account state after verification:', eba.state);
      }

      if (!eba || eba.state === 'storing' || eba.state === 'unverified') {
        throw new Error('External bank account could not be verified. Please try again.');
      }
      if (eba.state === 'failed' || eba.state === 'deleted' || eba.state === 'refresh_required') {
        throw new Error(`External bank account is in an invalid state: ${eba.state}. Please re-link your bank account.`);
      }

      const quote = await cybridApi(token, 'POST', '/api/quotes', {
        product_type: 'funding',
        customer_guid: customerGuid,
        asset: 'USD',
        side: 'deposit',
        receive_amount: amountCents,
      });

      const transferBody = {
        quote_guid: quote.guid,
        transfer_type: 'funding',
        external_bank_account_guid: externalBankAccountGuid,
        fiat_account_guid: fiatAccountGuid,
        payment_rail: 'ach',
        source_participants: [
          { type: 'customer', guid: customerGuid, amount: amountCents }
        ],
        destination_participants: [
          { type: 'customer', guid: customerGuid, amount: amountCents }
        ],
      };

      const transfer = await cybridApi(token, 'POST', '/api/transfers', transferBody);
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

      // Trades use POST /api/trades — pass both account guids so Cybrid knows source/destination
      const trade = await cybridApi(token, 'POST', '/api/trades', {
        quote_guid: quote.guid,
        fiat_account_guid: fiatAccountGuid,
        trading_account_guid: tradingAccountGuid,
      });
      return Response.json({ quote, transfer: trade });
    }

    // ── Step 13 & 14: Withdraw USD from fiat account to counterparty bank ────
    if (action === 'executeRemittance') {
      const { customerGuid, fiatAccountGuid, counterpartyExternalBankAccountGuid, counterpartyGuid, amountUSD } = params;
      const amountCents = Math.round(parseFloat(amountUSD) * 100);

      const quote = await cybridApi(token, 'POST', '/api/quotes', {
        product_type: 'funding',
        customer_guid: customerGuid,
        asset: 'USD',
        side: 'withdrawal',
        deliver_amount: amountCents,
      });

      const remittanceBody = {
        quote_guid: quote.guid,
        transfer_type: 'funding',
        external_bank_account_guid: counterpartyExternalBankAccountGuid,
        fiat_account_guid: fiatAccountGuid,
        payment_rail: 'ach',
        source_participants: [
          { type: 'customer', guid: customerGuid, amount: amountCents }
        ],
      };

      if (counterpartyGuid) {
        remittanceBody.destination_participants = [
          { type: 'counterparty', guid: counterpartyGuid, amount: amountCents }
        ];
      }

      const remittance = await cybridApi(token, 'POST', '/api/transfers', remittanceBody);
      return Response.json({ quote, remittance });
    }

    // ── Poll transfer status ──────────────────────────────────────────────────
    if (action === 'getTransfer') {
      const { transferGuid } = params;
      const transfer = await cybridApi(token, 'GET', `/api/transfers/${transferGuid}`);
      return Response.json({ transfer });
    }

    // ── DEBUG: Get bank info to inspect configuration ─────────────────────────
    if (action === 'getBankInfo') {
      const bank = await cybridApi(token, 'GET', `/api/banks/${CYBRID_BANK_GUID}`);
      return Response.json({ bank });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('cybridTransfer error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});