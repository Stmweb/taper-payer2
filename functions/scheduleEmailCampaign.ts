import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { campaign_id, scheduled_at } = await req.json();

    if (!campaign_id || !scheduled_at) {
      return Response.json({ error: 'campaign_id and scheduled_at are required' }, { status: 400 });
    }

    await base44.asServiceRole.entities.EmailCampaign.update(campaign_id, {
      status: 'scheduled',
      scheduled_at: scheduled_at,
    });

    return Response.json({ success: true, message: 'Campaign scheduled successfully' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});