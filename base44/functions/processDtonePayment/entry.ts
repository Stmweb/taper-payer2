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
    const { paymentMethodId, amount, fullPhone, productId } = await req.json();

    if (!paymentMethodId || !amount || !fullPhone || !productId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (parseFloat(amount) < 0.50) {
      return Response.json({ error: 'Minimum top-up amount is $0.50 USD. Please select a higher value plan.' }, { status: 400 });
    }

    const SERVICE_FEE = 1.00; // $1 service fee
    const totalCharge = parseFloat(amount) + SERVICE_FEE;

    // Step 1: Charge card via Stripe (top-up amount + $1 service fee)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalCharge * 100),
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
    console.log('DTone topup response:', topupRes.status, JSON.stringify(topupData).substring(0, 600));

    if (!topupRes.ok || topupData.errors) {
      const errMsg = topupData.errors?.[0]?.message || topupData.message || 'Top-up delivery failed';
      console.error('DTone topup failed:', errMsg, JSON.stringify(topupData));
      return Response.json({ error: errMsg, paymentIntentId: paymentIntent.id, details: topupData }, { status: 400 });
    }

    const txId = topupData.id;
    let finalStatus = topupData.status;

    // If transaction is in CONFIRMING state, explicitly confirm it
    if (finalStatus === 'CONFIRMING') {
      console.log('DTone transaction in CONFIRMING state, confirming...', txId);
      const confirmRes = await fetch(`${DTONE_BASE}/sync/transactions/${txId}/confirm`, {
        method: 'POST',
        headers: { Authorization: dtoneAuth(), Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: txId }),
      });
      const confirmData = await confirmRes.json();
      console.log('DTone confirm response:', confirmRes.status, JSON.stringify(confirmData).substring(0, 400));

      if (!confirmRes.ok || confirmData.errors) {
        const errMsg = confirmData.errors?.[0]?.message || 'Top-up confirmation failed';
        return Response.json({ error: errMsg, paymentIntentId: paymentIntent.id }, { status: 400 });
      }
      finalStatus = confirmData.status;
    }

    if (finalStatus === 'FAILED') {
      return Response.json({ error: 'Top-up delivery failed after charge', paymentIntentId: paymentIntent.id }, { status: 400 });
    }

    return Response.json({
      success: true,
      transactionId: txId,
      status: finalStatus,
      paymentIntentId: paymentIntent.id,
      phoneNumber: fullPhone,
      amount: parseFloat(amount),
      serviceFee: SERVICE_FEE,
      totalCharged: totalCharge,
      delivered: topupData.benefits?.[0]?.amount?.total_including_tax,
      deliveredUnit: topupData.benefits?.[0]?.unit,
    });
  } catch (error) {
    console.error('processDtonePayment error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});