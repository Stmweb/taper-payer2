import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SQUARE_APP_ID = Deno.env.get('SQUARE_APPLICATION_ID');
const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_LOCATION_ID');
const SQUARE_API_URL = 'https://connect.squareup.com/v2';

async function squareApi(method, endpoint, body = null) {
  const headers = {
    'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'Square-Version': '2024-04-17',
  };

  const res = await fetch(`${SQUARE_API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const errMsg = data?.errors?.[0]?.detail || data?.message || text;
    console.error(`Square API error [${method} ${endpoint}]:`, errMsg);
    throw new Error(errMsg);
  }

  return data;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, ...params } = await req.json();

    // ── Create a payment ──────────────────────────────────────────────────────
    if (action === 'createPayment') {
      const {
        amount,
        currency = 'USD',
        sourceId,
        description,
        customerId,
        orderId,
      } = params;

      // Amount in smallest currency unit (cents)
      const amountCents = Math.round(parseFloat(amount) * 100);

      const paymentBody = {
        idempotency_key: crypto.randomUUID(),
        source_id: sourceId,
        amount_money: {
          amount: amountCents,
          currency,
        },
        location_id: SQUARE_LOCATION_ID,
        ...(description && { note: description }),
        ...(customerId && { customer_id: customerId }),
        ...(orderId && { order_id: orderId }),
      };

      const payment = await squareApi('POST', '/payments', paymentBody);
      return Response.json({ payment });
    }

    // ── Create a payment link (for hosted checkout) ────────────────────────
    if (action === 'createPaymentLink') {
      const {
        amount,
        currency = 'USD',
        description,
        orderId,
        redirectUrl,
      } = params;

      const amountCents = Math.round(parseFloat(amount) * 100);

      const linkBody = {
        quick_pay: {
          name: description || 'Payment',
          price_money: {
            amount: amountCents,
            currency,
          },
        },
        checkout_options: {
          ask_for_shipping_address: false,
        },
      };

      if (redirectUrl) {
        linkBody.checkout_options.redirect_url = redirectUrl;
      }

      const link = await squareApi('POST', '/online-checkout/payment-links', linkBody);
      return Response.json({ paymentLink: link });
    }

    // ── Retrieve a payment ────────────────────────────────────────────────────
    if (action === 'getPayment') {
      const { paymentId } = params;
      const payment = await squareApi('GET', `/payments/${paymentId}`);
      return Response.json({ payment });
    }

    // ── List payments ─────────────────────────────────────────────────────────
    if (action === 'listPayments') {
      const { limit = 100, cursor } = params;
      let endpoint = `/payments?limit=${limit}`;
      if (cursor) endpoint += `&cursor=${cursor}`;
      const result = await squareApi('GET', endpoint);
      return Response.json({ payments: result.result?.payments || [], cursor: result.result?.cursor });
    }

    // ── Refund a payment ──────────────────────────────────────────────────────
    if (action === 'refundPayment') {
      const { paymentId, amount, reason } = params;
      const amountCents = Math.round(parseFloat(amount) * 100);

      const refundBody = {
        payment_id: paymentId,
        amount_money: {
          amount: amountCents,
          currency: 'USD',
        },
        ...(reason && { reason }),
      };

      const refund = await squareApi('POST', '/refunds', refundBody);
      return Response.json({ refund });
    }

    // ── Create or update customer ────────────────────────────────────────────
    if (action === 'createCustomer') {
      const { email, name, phone } = params;
      const customerBody = {
        ...(email && { email_address: email }),
        ...(name && { given_name: name.split(' ')[0], family_name: name.split(' ').slice(1).join(' ') }),
        ...(phone && { phone_number: phone }),
      };

      const customer = await squareApi('POST', '/customers', customerBody);
      return Response.json({ customer });
    }

    // ── Get customer ──────────────────────────────────────────────────────────
    if (action === 'getCustomer') {
      const { customerId } = params;
      const customer = await squareApi('GET', `/customers/${customerId}`);
      return Response.json({ customer });
    }

    // ── Create payment source (card on file) ────────────────────────────────
    if (action === 'createCardOnFile') {
      const { customerId, sourceId, cardholderName } = params;
      const sourceBody = {
        source_id: sourceId,
        card_details: {
          cardholder_name: cardholderName,
        },
      };

      const source = await squareApi('POST', `/customers/${customerId}/cards`, sourceBody);
      return Response.json({ source });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('squarePayments error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});