import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import braintree from 'npm:braintree@3.19.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: Deno.env.get('BRAINTREE_MERCHANT_ID'),
      publicKey: Deno.env.get('BRAINTREE_PUBLIC_KEY'),
      privateKey: Deno.env.get('BRAINTREE_PRIVATE_KEY'),
    });

    const response = await gateway.clientToken.generate({});

    return Response.json({ clientToken: response.clientToken });
  } catch (error) {
    console.error('getBraintreeToken error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});