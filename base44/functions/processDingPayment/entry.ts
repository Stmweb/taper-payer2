import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import Stripe from 'npm:stripe@14.0.0';

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const DING_API_KEY = Deno.env.get("DING_API_KEY");
const BASE_URL = "https://api.dingconnect.com/api/V1";

const stripe = new Stripe(STRIPE_SECRET_KEY);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentMethodId, fullPhone, amount, skuCode } = await req.json();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((amount + 1.00) * 100), // Add $1 service fee
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: window?.location?.origin || 'https://taperpayer.com',
    });

    if (paymentIntent.status !== 'succeeded') {
      return Response.json({
        success: false,
        error: 'Payment failed. Please try again.',
      });
    }

    // Send top-up via Ding
    const dingPayload = {
      SenderPhoneNumber: "+10000000000",
      RecipientPhoneNumber: fullPhone,
      SkuCode: skuCode,
      SendingAmount: amount,
      SendingCurrencyIso: "USD",
      DistributorRef: "TPAY-" + Date.now(),
      ValidateOnly: false,
    };

    const dingRes = await fetch(`${BASE_URL}/SendTransfer`, {
      method: "POST",
      headers: { "api_key": DING_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(dingPayload),
    });

    const dingData = await dingRes.json();

    if (dingData.ResultCode === 1) {
      return Response.json({
        success: true,
        transactionId: dingData.TransactionId,
        reference: dingData.DistributorRef,
      });
    } else {
      return Response.json({
        success: false,
        error: dingData.ErrorCodes?.[0]?.Code || 'Top-up failed. Please try again.',
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});