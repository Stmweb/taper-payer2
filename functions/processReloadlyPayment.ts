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

    const { paymentMethodId, amount, phoneNumber, countryCode, operatorId, dtoneProductId, fullPhone } = await req.json();

    if (!paymentMethodId || !amount || !phoneNumber || !countryCode) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
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
    const mobileNumber = fullPhone || phoneNumber;
    const externalId = `TPAY-${paymentIntent.id.substring(0, 20)}`;

    let productId = dtoneProductId;

    // If no product ID, look one up by operator
    if (!productId && operatorId) {
      const iso2To3 = { HT: 'HTI', IN: 'IND', PH: 'PHL', NG: 'NGA', KE: 'KEN', GH: 'GHA', MX: 'MEX', BR: 'BRA', SN: 'SEN', AO: 'AGO', DO: 'DOM', CL: 'CHL', MA: 'MAR' };
      const iso3 = iso2To3[countryCode] || countryCode;
      const pRes = await fetch(
        `${DTONE_BASE}/products?country_iso_code=${iso3}&type=FIXED_VALUE_RECHARGE&per_page=100`,
        { headers: { Authorization: dtoneAuth(), Accept: 'application/json' } }
      );
      const products = await pRes.json();
      const match = Array.isArray(products) ? products.find(p => p.operator?.id === parseInt(operatorId)) : null;
      if (match) productId = match.id;
    }

    if (!productId) {
      return Response.json({ error: 'Could not determine product for top-up. Payment was charged — please contact support.', paymentIntentId: paymentIntent.id }, { status: 400 });
    }

    const topupRes = await fetch(`${DTONE_BASE}/sync/transactions`, {
      method: 'POST',
      headers: { Authorization: dtoneAuth(), Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        auto_confirm: true,
        credit_party_identifier: { mobile_number: mobileNumber },
        external_id: externalId,
      }),
    });

    const topupData = await topupRes.json();
    console.log('DTone topup response:', topupRes.status, JSON.stringify(topupData).substring(0, 500));

    if (!topupRes.ok || topupData.status === 'FAILED' || topupData.errors) {
      const errMsg = topupData.errors?.[0]?.message || topupData.message || 'Top-up delivery failed';
      return Response.json({ error: errMsg, paymentIntentId: paymentIntent.id, details: topupData }, { status: 400 });
    }

    return Response.json({
      success: true,
      transactionId: topupData.id,
      paymentIntentId: paymentIntent.id,
      phoneNumber: mobileNumber,
      amount: parseFloat(amount),
    });
  } catch (error) {
    console.error('processReloadlyPayment error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});