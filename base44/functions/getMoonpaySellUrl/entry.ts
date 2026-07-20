import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const SUPPORTED = ['BNB', 'USDC', 'USDT'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let { walletAddress, currencyCode } = await req.json().catch(() => ({}));
    if (!walletAddress) {
      const users = await base44.asServiceRole.entities.AppUser.filter({ email: user.email });
      walletAddress = users[0]?.wallet_address;
    }
    if (!walletAddress) {
      return Response.json({ error: 'No wallet address found' }, { status: 400 });
    }

    const code = SUPPORTED.includes(currencyCode) ? currencyCode : 'BNB';

    const publishableKey = Deno.env.get('MOONPAY_PUBLISHABLE_KEY');
    if (!publishableKey) {
      return Response.json({ error: 'MoonPay not configured' }, { status: 500 });
    }

    const url = `https://sell.moonpay.com/?apiKey=${encodeURIComponent(publishableKey)}&defaultCurrencyCode=${code}&payoutWalletAddress=${encodeURIComponent(walletAddress)}`;

    return Response.json({ url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});