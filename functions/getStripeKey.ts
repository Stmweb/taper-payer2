import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripePublicKey = Deno.env.get('STRIPE_PUBLIC_KEY');
    
    if (!stripePublicKey) {
      return Response.json(
        { error: 'Stripe public key not configured' },
        { status: 500 }
      );
    }

    return Response.json({ publicKey: stripePublicKey });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});