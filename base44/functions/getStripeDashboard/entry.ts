import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let user = null;
    try {
      user = await base44.auth.me();
    } catch (e) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

    const moncashTopups = await base44.asServiceRole.entities.PendingTopup.list('-created_date', 200);

    let transactions = [];
    let subscriptions = [];
    let stats = {
      total_volume: 0,
      monthly_volume: 0,
      total_transactions: 0,
      successful_charges: 0,
      active_subscriptions: 0,
      total_subscriptions: 0,
    };

    if (stripeKey) {
      const stripe = new Stripe(stripeKey);
      const [paymentIntents, stripeSubs, charges] = await Promise.all([
        stripe.paymentIntents.list({ limit: 50 }),
        stripe.subscriptions.list({ limit: 10, status: 'all' }),
        stripe.charges.list({ limit: 100 }),
      ]);

      const succeededCharges = charges.data.filter(c => c.status === 'succeeded');
      const totalVolume = succeededCharges.reduce((sum, c) => sum + c.amount, 0);
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
      const monthlyCharges = succeededCharges.filter(c => c.created >= thirtyDaysAgo);
      const monthlyVolume = monthlyCharges.reduce((sum, c) => sum + c.amount, 0);

      transactions = paymentIntents.data.map(pi => ({
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        created: pi.created,
        description: pi.description,
        customer: pi.customer,
      }));

      subscriptions = stripeSubs.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        current_period_end: sub.current_period_end,
        current_period_start: sub.current_period_start,
        plan: sub.items?.data[0]?.price?.nickname || sub.items?.data[0]?.price?.id,
        amount: sub.items?.data[0]?.price?.unit_amount,
        currency: sub.items?.data[0]?.price?.currency,
        customer: sub.customer,
      }));

      stats = {
        total_volume: totalVolume,
        monthly_volume: monthlyVolume,
        total_transactions: paymentIntents.data.length,
        successful_charges: succeededCharges.length,
        active_subscriptions: stripeSubs.data.filter(s => s.status === 'active').length,
        total_subscriptions: stripeSubs.data.length,
      };
    }

    return Response.json({
      transactions,
      moncash_topups: moncashTopups,
      subscriptions,
      stats,
      stripe_configured: !!stripeKey,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});