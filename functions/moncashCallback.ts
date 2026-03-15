import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  // Handle both GET (Return URL) and POST (Alert URL)
  try {
    const base44 = createClientFromRequest(req);
    
    // Parse request data
    let paymentData = {};
    if (req.method === 'POST') {
      paymentData = await req.json();
    } else if (req.method === 'GET') {
      const url = new URL(req.url);
      paymentData = Object.fromEntries(url.searchParams);
    }

    // Log the callback for debugging
    console.log('Moncash Callback:', {
      method: req.method,
      timestamp: new Date().toISOString(),
      data: paymentData
    });

    // Verify the callback is from Moncash (optional but recommended)
    // You would validate the signature here if Moncash provides one

    // For now, just acknowledge receipt
    if (req.method === 'POST') {
      // Alert URL - acknowledge the notification
      return new Response(
        JSON.stringify({ status: 'success', message: 'Notification received' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      // Return URL - redirect to home page
      return new Response(null, {
        status: 302,
        headers: { 'Location': '/' }
      });
    }
  } catch (error) {
    console.error('Moncash Callback Error:', error);
    return new Response(
      JSON.stringify({ error: 'Callback processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});