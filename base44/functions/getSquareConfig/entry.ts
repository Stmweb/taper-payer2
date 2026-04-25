import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const squareAppId = Deno.env.get('SQUARE_APPLICATION_ID');
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID');

    if (!squareAppId || !squareLocationId) {
      return Response.json({ error: 'Square configuration missing' }, { status: 500 });
    }

    return Response.json({
      squareApplicationId: squareAppId,
      squareLocationId: squareLocationId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});