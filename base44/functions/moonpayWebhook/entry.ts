import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Verify MoonPay webhook signature: HMAC-SHA256(rawBody, webhookKey) -> hex
async function verifySignature(rawBody, signature, webhookKey) {
  if (!signature || !webhookKey) return false;
  const keyData = new TextEncoder().encode(webhookKey);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(rawBody));
  const computed = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
  // signature may be "v1=hex" format or plain hex
  const cleanSig = signature.startsWith('v1=') ? signature.slice(3) : signature;
  return computed === cleanSig;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const webhookKey = Deno.env.get('MOONPAY_WEBHOOK_KEY');
    const rawBody = await req.text();
    const signature = req.headers.get('Moonpay-Signature') || req.headers.get('MoonPay-Signature') || '';

    // Verify authenticity — anyone can reach this endpoint
    const valid = await verifySignature(rawBody, signature, webhookKey);
    if (!valid) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const type = event?.type || event?.eventType;
    const data = event?.data || event;

    // Only act on completion events
    const completionEvents = [
      'crypto_deposit_completed',
      'deposit_completed',
      'crypto_payment_completed',
      'payment_completed',
    ];

    if (!completionEvents.includes(type)) {
      return Response.json({ received: true, ignored: type });
    }

    const walletAddress = data?.walletAddress || data?.address || data?.cryptoWalletAddress;
    const amount = data?.quoteCurrencyAmount || data?.cryptoAmount || data?.amount;
    const currency = data?.baseCurrencyCode || data?.currencyCode || data?.cryptoCurrency || '';

    if (!walletAddress) {
      return Response.json({ received: true, noWallet: true });
    }

    // Find the app user who owns this wallet
    const users = await base44.asServiceRole.entities.AppUser.filter({ wallet_address: walletAddress });
    const owner = users[0];

    if (!owner || !owner.fcm_token) {
      return Response.json({ received: true, noOwnerOrToken: true });
    }

    // Send a push notification
    const title = 'Funds Received 💰';
    const bodyText = amount
      ? `Your MoonPay purchase of ${amount} ${currency} has completed and is in your wallet.`
      : 'Your MoonPay purchase has completed and is in your wallet.';

    await base44.asServiceRole.functions.invoke('sendPushNotification', {
      token: owner.fcm_token,
      title,
      body: bodyText,
      type: 'moonpay_deposit',
      data: { walletAddress, amount: String(amount || ''), currency, eventType: type },
    });

    return Response.json({ success: true, notified: owner.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});