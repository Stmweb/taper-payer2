import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { campaign_id } = await req.json();

    if (!campaign_id) {
      return Response.json({ error: 'campaign_id is required' }, { status: 400 });
    }

    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return Response.json({ error: 'Mailgun credentials not configured' }, { status: 500 });
    }

    // Fetch the campaign
    const campaigns = await base44.asServiceRole.entities.EmailCampaign.filter({ id: campaign_id });
    if (!campaigns || campaigns.length === 0) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }
    const campaign = campaigns[0];

    // Fetch active subscribers
    let subscribers = await base44.asServiceRole.entities.Subscriber.filter({ status: 'active' });

    // Filter by tags if specified
    if (campaign.target_tags && campaign.target_tags.length > 0) {
      subscribers = subscribers.filter(sub =>
        sub.tags && sub.tags.some(tag => campaign.target_tags.includes(tag))
      );
    }

    if (subscribers.length === 0) {
      return Response.json({ error: 'No active subscribers found' }, { status: 400 });
    }

    // Send emails via Mailgun
    let sentCount = 0;
    const errors = [];

    for (const subscriber of subscribers) {
      const formData = new FormData();
      formData.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
      formData.append('to', subscriber.email);
      formData.append('subject', campaign.subject);
      formData.append('html', campaign.body_html);

      const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`)
        },
        body: formData
      });

      if (response.ok) {
        sentCount++;
      } else {
        const err = await response.text();
        errors.push({ email: subscriber.email, error: err });
      }
    }

    // Update campaign status
    await base44.asServiceRole.entities.EmailCampaign.update(campaign_id, {
      status: sentCount > 0 ? 'sent' : 'failed',
      sent_count: sentCount,
      sent_at: new Date().toISOString()
    });

    return Response.json({
      success: true,
      sent_count: sentCount,
      total: subscribers.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});