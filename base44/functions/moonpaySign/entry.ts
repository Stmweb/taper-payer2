import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { createHmac } from 'node:crypto';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { urlToSign } = body;

    if (!urlToSign) {
      return Response.json({ error: 'urlToSign is required' }, { status: 400 });
    }

    const secretKey = Deno.env.get('MOONPAY_SECRET_KEY');
    if (!secretKey) {
      return Response.json({ error: 'MoonPay secret key not configured' }, { status: 500 });
    }

    // Extract the query string from the URL to sign
    const url = new URL(urlToSign);
    const queryString = url.search;

    // Sign using HMAC-SHA256
    const signature = createHmac('sha256', secretKey)
      .update(queryString)
      .digest('base64');

    const signedUrl = `${urlToSign}&signature=${encodeURIComponent(signature)}`;

    return Response.json({ signedUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});