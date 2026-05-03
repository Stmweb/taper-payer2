import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token, tokens, title, body, data, type } = await req.json();

    const serverKey = Deno.env.get('FIREBASE_SERVER_KEY');
    if (!serverKey) {
      return Response.json({ error: 'Firebase server key not configured' }, { status: 500 });
    }

    // Support single token or multiple tokens
    const targetTokens = tokens || (token ? [token] : []);
    if (targetTokens.length === 0) {
      return Response.json({ error: 'No FCM token(s) provided' }, { status: 400 });
    }

    const payload = {
      notification: {
        title: title || 'Taper Payer',
        body: body || '',
        icon: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png',
      },
      data: {
        type: type || 'general',
        ...data,
      },
    };

    let result;
    if (targetTokens.length === 1) {
      // Single device
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${serverKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, to: targetTokens[0] }),
      });
      result = await response.json();
    } else {
      // Multiple devices
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${serverKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, registration_ids: targetTokens }),
      });
      result = await response.json();
    }

    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});