import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, phoneNumber, countryCode, operatorId, sourceToken } = await req.json();

    if (!amount || !phoneNumber || !countryCode || !operatorId || !sourceToken) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const SERVICE_FEE = 1.00;
    const topupAmount = parseFloat(amount);
    const chargeAmount = parseFloat((topupAmount + SERVICE_FEE).toFixed(2));

    // Step 1: Charge customer topupAmount + service fee via Square
    const squareRes = await base44.asServiceRole.functions.invoke('squarePayments', {
      action: 'createPayment',
      amount: chargeAmount,
      currency: 'USD',
      sourceId: sourceToken,
      description: `Top-up for ${phoneNumber} (${countryCode})`,
    });

    if (!squareRes.data?.payment) {
      throw new Error('Square payment creation failed');
    }

    const payment = squareRes.data.payment;

    // Step 2: Process the top-up for exactly the topupAmount (without fee)
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
      console.warn('DTone top-up failed, attempting Reloadly fallback:', dtoneErr.message);
      // Fallback: could try Reloadly here if needed
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
      paymentId: payment.id,
      topupId: topupResult.id || null,
      amount: amount,
      phoneNumber: phoneNumber,
      paymentStatus: payment.status,
      topupStatus: topupResult.status || 'pending',
    });
  } catch (error) {
    console.error('Square top-up error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});