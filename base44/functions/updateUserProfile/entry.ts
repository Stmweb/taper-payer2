import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { field, value, email } = body;

    if (!email || !field || value === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the AppUser by email
    const users = await base44.asServiceRole.entities.AppUser.filter({ email });
    if (!users || users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    // Update the field
    const updated = await base44.asServiceRole.entities.AppUser.update(user.id, { [field]: value });

    return Response.json({ success: true, user: { ...user, [field]: value } });
  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});