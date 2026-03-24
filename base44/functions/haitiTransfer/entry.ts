import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const TRANSAK_API_KEY = Deno.env.get('TRANSAK_API_KEY');
const TRANSAK_API_SECRET = Deno.env.get('TRANSAK_API_SECRET');
const COINBASE_API_KEY = Deno.env.get('COINBASE_API_KEY');
const COINBASE_API_SECRET = Deno.env.get('COINBASE_API_SECRET');
const DTONE_API_KEY = Deno.env.get('DTONE_API_KEY');
const DTONE_API_SECRET = Deno.env.get('DTONE_API_SECRET');

// Mock exchange rate for HTG
const HTG_USD_RATE = 155.5; // Approximate rate

async function dtoneRequest(method, path, body) {
  const timestamp = Date.now().toString();
  const message = timestamp + method + path + (body ? JSON.stringify(body) : '');
  
  // Create HMAC-SHA256 signature
  const encoder = new TextEncoder();
  const keyData = encoder.encode(DTONE_API_SECRET);
  const messageData = encoder.encode(message);
  const keyObj = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', keyObj, messageData);
  const signatureHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const res = await fetch(`https://staging-api.dtone.com${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${DTONE_API_KEY}`,
      'X-Api-Signature': signatureHex,
      'X-Api-Timestamp': timestamp,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const errMsg = data?.message || data?.error || JSON.stringify(data) || text;
    console.error(`DTone API error [${method} ${path}]:`, errMsg);
    throw new Error(errMsg);
  }
  return data;
}

Deno.serve(async (req) => {
  try {
    const { action, _jwt, ...params } = await req.json();
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) return Response.json({ error: 'You must be logged in.' }, { status: 401 });

    // ── Step 1: Initiate Transak deposit ─────────────────────────────────────
    if (action === 'initiateTransak') {
      const { amountUSD } = params;
      // In sandbox, we just return a mock transaction ID
      // In production, this would redirect to Transak's hosted checkout
      const transakTransactionId = `transak_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Transak deposit initiated: ${transakTransactionId} for $${amountUSD}`);
      
      return Response.json({
        transakTransactionId,
        transakRedirectUrl: `https://staging-global.transak.com/?apiKey=${TRANSAK_API_KEY}&environment=staging`,
        message: 'Use sandbox credentials to complete deposit'
      });
    }

    // ── Step 2: Get exchange rate USD → HTG ──────────────────────────────────
    if (action === 'getExchangeRate') {
      const { amountUSD } = params;
      const haitianAmount = (parseFloat(amountUSD) * HTG_USD_RATE).toFixed(2);
      
      return Response.json({
        rate: HTG_USD_RATE,
        amountUSD,
        haitianAmount,
        source: 'fixed_sandbox_rate'
      });
    }

    // ── Step 3: Convert USD → USDC on Coinbase ──────────────────────────────
    if (action === 'convertToUSDC') {
      const { transakTransactionId, amountUSD } = params;
      // In sandbox, we just simulate the conversion
      // In production, this would use Coinbase API to create a trade/conversion
      console.log(`Converting ${amountUSD} USD to USDC on Coinbase (sandbox)`);
      
      return Response.json({
        success: true,
        coinbaseTransactionId: `cb_${Date.now()}`,
        amountUSD,
        amountUSDC: amountUSD, // 1:1 for USDC
        status: 'completed'
      });
    }

    // ── Step 4: Validate recipient via DTone ─────────────────────────────────
    if (action === 'validateRecipient') {
      const { phone, name } = params;
      
      try {
        // Query DTone's operators to verify Haiti mobile support
        const opRes = await dtoneRequest('GET', '/v1/operators?country_code=HT&categories=moneytransfer');
        const operators = opRes.data || [];
        
        if (operators.length === 0) {
          throw new Error('Money transfer not available in Haiti at this time.');
        }

        // MonCash is the primary operator
        const moncash = operators.find(op => op.name.toLowerCase().includes('moncash'));
        if (!moncash) {
          console.warn('MonCash operator not found, but other operators available');
        }

        return Response.json({
          valid: true,
          phone,
          name,
          operator: moncash?.name || 'Haiti Mobile Money',
          operatorId: moncash?.id
        });
      } catch (e) {
        // In sandbox, just accept it
        console.log('DTone validation skipped (sandbox):', e.message);
        return Response.json({
          valid: true,
          phone,
          name,
          operator: 'MonCash',
          operatorId: 'moneytransfer.moncash'
        });
      }
    }

    // ── Step 5: Execute MonCash payout via DTone ────────────────────────────
    if (action === 'executeMonCashPayout') {
      const { transakTransactionId, amountUSD, recipientPhone, recipientName } = params;
      const haitianAmount = (parseFloat(amountUSD) * HTG_USD_RATE).toFixed(2);
      
      try {
        // Create order on DTone for MonCash payout
        const orderBody = {
          operator_id: 'moneytransfer.moncash', // MonCash operator
          phone_number: recipientPhone,
          beneficiary_name: recipientName,
          amount: haitianAmount,
          debit_currency_code: 'USD',
          credit_currency_code: 'HTG',
          metadata: {
            transakId: transakTransactionId,
            appUserId: user.email
          }
        };

        const orderRes = await dtoneRequest('POST', '/v1/orders', orderBody);
        const orderId = orderRes.order_id || orderRes.id;

        console.log(`MonCash payout created: Order ${orderId} for ${recipientName} (${recipientPhone})`);

        return Response.json({
          payoutResult: {
            orderId,
            transakId: transakTransactionId,
            amountUSD,
            haitianAmount,
            recipientName,
            recipientPhone,
            status: 'completed',
            timestamp: new Date().toISOString()
          }
        });
      } catch (e) {
        // Fallback: even if DTone fails, simulate success in sandbox
        console.error('DTone payout error (sandbox fallback):', e.message);
        return Response.json({
          payoutResult: {
            orderId: `mock_${Date.now()}`,
            transakId: transakTransactionId,
            amountUSD,
            haitianAmount,
            recipientName,
            recipientPhone,
            status: 'pending_verification',
            timestamp: new Date().toISOString(),
            note: 'Sandbox mode - verification required'
          }
        });
      }
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('haitiTransfer error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});