import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Helper to validate the partner API key from headers
export function validateApiKey(req: Request): boolean {
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
  const validKey = Deno.env.get('TAPER_PAYER_API_KEY');
  return !!(apiKey && validKey && apiKey === validKey);
}

Deno.serve(async (req) => {
  try {
    const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
    const validKey = Deno.env.get('TAPER_PAYER_API_KEY');

    if (!apiKey || !validKey || apiKey !== validKey) {
      return Response.json({ error: 'Invalid or missing API key' }, { status: 401 });
    }

    return Response.json({
      success: true,
      message: 'API key is valid',
      platform: 'Taper Payer',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});