import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@16.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const RELOADLY_CLIENT_ID = Deno.env.get('RELOADLY_CLIENT_ID');
const RELOADLY_CLIENT_SECRET = Deno.env.get('RELOADLY_CLIENT_SECRET');

async function getReloadlyToken() {
  const res = await fetch('https://auth.reloadly.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: RELOADLY_CLIENT_ID,
      client_secret: RELOADLY_CLIENT_SECRET,
      grant_type: 'client_credentials',
      audience: 'https://topups.reloadly.com'
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Auth failed');
  return data.access_token;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentMethodId, amount, phoneNumber, countryCode, operatorId } = await req.json();

    if (!paymentMethodId || !amount || !phoneNumber || !countryCode) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100),
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    if (paymentIntent.status !== 'succeeded') {
      return Response.json(
        { error: 'Payment failed', status: paymentIntent.status },
        { status: 400 }
      );
    }

    // Process Reloadly topup
    const token = await getReloadlyToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/com.reloadly.topups-v1+json'
    };

    const reloadlyRes = await fetch('https://topups.reloadly.com/topups', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operatorId: operatorId || 173,
        amount: parseFloat(amount),
        useLocalAmount: false,
        customIdentifier: `tpay-${paymentIntent.id}`,
        recipientPhone: { countryCode, number: phoneNumber.replace(/^\+?1?/, '') },
        senderPhone: { countryCode: 'US', number: '3051234567' }
      })
    });

    const reloadlyData = await reloadlyRes.json();

    if (!reloadlyRes.ok) {
      return Response.json(
        { error: reloadlyData.message || 'Top-up failed' },
        { status: reloadlyRes.status }
      );
    }

    return Response.json({
      success: true,
      transactionId: reloadlyData.id,
      paymentIntentId: paymentIntent.id,
      phoneNumber,
      amount: parseFloat(amount),
      countryCode
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});