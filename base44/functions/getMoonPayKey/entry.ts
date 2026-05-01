import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const key = Deno.env.get('MOONPAY_PUBLISHABLE_KEY');
    if (!key) {
      return Response.json({ error: 'MoonPay key not configured' }, { status: 500 });
    }

    return Response.json({ key });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to get MoonPay key' }, { status: 500 });
  }
});