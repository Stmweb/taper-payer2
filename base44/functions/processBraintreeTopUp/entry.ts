import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import braintree from 'npm:braintree@3.19.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, phoneNumber, countryCode, operatorId, paymentMethodNonce } = await req.json();

    if (!amount || !phoneNumber || !countryCode || !operatorId || !paymentMethodNonce) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const SERVICE_FEE = 1.00;
    const topupAmount = parseFloat(amount);
    const chargeAmount = parseFloat((topupAmount + SERVICE_FEE).toFixed(2));

    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: Deno.env.get('BRAINTREE_MERCHANT_ID'),
      publicKey: Deno.env.get('BRAINTREE_PUBLIC_KEY'),
      privateKey: Deno.env.get('BRAINTREE_PRIVATE_KEY'),
    });

    // Step 1: Charge via Braintree
    const result = await gateway.transaction.sale({
      amount: chargeAmount.toFixed(2),
      paymentMethodNonce,
      orderId: `topup-${phoneNumber}-${Date.now()}`,
      options: { submitForSettlement: true },
    });

    if (!result.success) {
      const msg = result.transaction?.processorResponseText || result.message || 'Payment failed';
      return Response.json({ error: msg }, { status: 400 });
    }

    const transaction = result.transaction;
    console.log('Braintree payment successful:', transaction.id);

    // Step 2: Execute DTone top-up
    let topupResult = {};
    try {
      const dtoneRes = await base44.asServiceRole.functions.invoke('processTopUp', {
        phoneNumber,
        amount: topupAmount,
        countryCode,
        operatorId,
      });
      topupResult = dtoneRes.data?.transaction || {};
    } catch (dtoneErr) {
      console.warn('DTone top-up failed:', dtoneErr.message);
    }

    // Step 3: Send confirmation notification
    try {
      const notifPhone = phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber.replace(/\D/g, '');
      await base44.asServiceRole.functions.invoke('sendNotification', {
        type: 'topup_confirmation',
        recipient: notifPhone,
        amount: String(amount),
        currency: 'USD',
      });
    } catch (notifErr) {
      console.log('Notification failed (non-blocking):', notifErr.message);
    }

    return Response.json({
      success: true,
      paymentId: transaction.id,
      topupId: topupResult.id || null,
      amount,
      phoneNumber,
      paymentStatus: transaction.status,
      topupStatus: topupResult.status || 'pending',
    });
  } catch (error) {
    console.error('processBraintreeTopUp error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});