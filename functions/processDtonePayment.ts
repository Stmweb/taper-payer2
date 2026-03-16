import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@16.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const DTONE_KEY = Deno.env.get('DTONE_API_KEY');
const DTONE_SECRET = Deno.env.get('DTONE_API_SECRET');
const DTONE_BASE = 'https://dvs-api.dtone.com/v1';

function dtoneAuth() {
  return 'Basic ' + btoa(`${DTONE_KEY}:${DTONE_SECRET}`);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { paymentMethodId, amount, fullPhone, productId } = await req.json();

    if (!paymentMethodId || !amount || !fullPhone || !productId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (parseFloat(amount) < 0.50) {
      return Response.json({ error: 'Minimum top-up amount is $0.50 USD. Please select a higher value plan.' }, { status: 400 });
    }

    // Step 1: Charge card via Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100),
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return Response.json({ error: 'Payment failed', status: paymentIntent.status }, { status: 400 });
    }

    // Step 2: Send top-up via DTone
    const externalId = `TPAY-${paymentIntent.id.substring(0, 20)}`;

    const topupRes = await fetch(`${DTONE_BASE}/sync/transactions`, {
      method: 'POST',
      headers: { Authorization: dtoneAuth(), Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: parseInt(productId),
        auto_confirm: true,
        credit_party_identifier: { mobile_number: fullPhone },
        external_id: externalId,
      }),
    });

    const topupData = await topupRes.json();
    console.log('DTone topup response:', topupRes.status, JSON.stringify(topupData).substring(0, 500));

    // DTone returns 201 for created transactions; errors come as 4xx with an errors array
    if (!topupRes.ok || topupData.errors) {
      const errMsg = topupData.errors?.[0]?.message || topupData.message || 'Top-up delivery failed';
      console.error('DTone topup failed:', errMsg, JSON.stringify(topupData));
      return Response.json({ error: errMsg, paymentIntentId: paymentIntent.id, details: topupData }, { status: 400 });
    }

    // DTone sync transaction — check for explicit FAILED status in response
    if (topupData.status === 'FAILED') {
      const errMsg = topupData.errors?.[0]?.message || topupData.message || 'Top-up delivery failed after charge';
      console.error('DTone topup FAILED status:', errMsg);
      return Response.json({ error: errMsg, paymentIntentId: paymentIntent.id, details: topupData }, { status: 400 });
    }

    return Response.json({
      success: true,
      transactionId: topupData.id,
      status: topupData.status,
      paymentIntentId: paymentIntent.id,
      phoneNumber: fullPhone,
      amount: parseFloat(amount),
      delivered: topupData.benefits?.[0]?.amount?.total_including_tax,
      deliveredUnit: topupData.benefits?.[0]?.unit,
    });
  } catch (error) {
    console.error('processDtonePayment error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});