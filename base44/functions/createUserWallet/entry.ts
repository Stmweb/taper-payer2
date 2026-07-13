import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const secretKey = Deno.env.get('THIRDWEB_SECRET_KEY');
    if (!secretKey) return Response.json({ error: 'THIRDWEB_SECRET_KEY not configured' }, { status: 500 });

    // Create or retrieve a server wallet using the user's unique ID as identifier
    const response = await fetch('https://api.thirdweb.com/v1/wallets/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': secretKey,
      },
      body: JSON.stringify({ identifier: user.id }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data?.message || 'Failed to create wallet', details: data }, { status: response.status });
    }

    const walletAddress = data?.result?.address;

    // Store wallet address on the AppUser record
    if (walletAddress) {
      await base44.asServiceRole.entities.AppUser.updateMany(
        { email: user.email },
        { $set: { wallet_address: walletAddress } }
      );
    }

    return Response.json({
      success: true,
      walletAddress,
      userId: data?.result?.userId,
      createdAt: data?.result?.createdAt,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});