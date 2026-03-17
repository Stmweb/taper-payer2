import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This runs as a scheduled function, so use service role
    const now = new Date().toISOString();

    // Fetch all scheduled campaigns
    const campaigns = await base44.asServiceRole.entities.EmailCampaign.filter({ status: 'scheduled' });

    const due = campaigns.filter(c => c.scheduled_at && c.scheduled_at <= now);

    if (due.length === 0) {
      return Response.json({ success: true, message: 'No campaigns due', processed: 0 });
    }

    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = 'mail.taperpayer.com';

    let processed = 0;
    for (const campaign of due) {
      let subscribers = await base44.asServiceRole.entities.Subscriber.filter({ status: 'active' });

      if (campaign.target_tags && campaign.target_tags.length > 0) {
        subscribers = subscribers.filter(sub =>
          sub.tags && sub.tags.some(tag => campaign.target_tags.includes(tag))
        );
      }

      if (subscribers.length === 0) {
        await base44.asServiceRole.entities.EmailCampaign.update(campaign.id, { status: 'failed' });
        continue;
      }

      const signature = `
<div style="margin-top:40px;padding-top:24px;border-top:2px solid #e2e8f0;font-family:Arial,sans-serif;">
  <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png" alt="Taper Payer" style="height:120px;width:auto;max-width:300px;display:block;margin:0 auto 10px auto;object-fit:contain;" /><br/>
  <span style="font-size:13px;color:#475569;">Taper Payer LLC · 254 Chapman Rd, Ste 208, Newark, DE 19702<br/>
  <a href="mailto:info@taperpayer.com" style="color:#3D7BB7;">info@taperpayer.com</a> · <a href="https://taperpayer.com" style="color:#3D7BB7;">taperpayer.com</a></span>
</div>`;

      let sentCount = 0;
      for (const subscriber of subscribers) {
        const formData = new FormData();
        formData.append('from', `Taper Payer <noreply@${MAILGUN_DOMAIN}>`);
        formData.append('to', subscriber.email);
        formData.append('subject', campaign.subject);
        formData.append('html', campaign.body_html + signature);

        const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
          method: 'POST',
          headers: { 'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`) },
          body: formData
        });

        if (response.ok) sentCount++;
      }

      await base44.asServiceRole.entities.EmailCampaign.update(campaign.id, {
        status: sentCount > 0 ? 'sent' : 'failed',
        sent_count: sentCount,
        sent_at: new Date().toISOString()
      });
      processed++;
    }

    return Response.json({ success: true, processed, message: `Processed ${processed} scheduled campaigns` });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});