import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const enhancedPrompt = `You are a multilingual AI that understands prompts in any language including French. Based on the following prompt, generate a professional marketing flyer image: ${prompt}`;
    const result = await base44.asServiceRole.integrations.Core.GenerateImage({ prompt: enhancedPrompt });

    return Response.json({ url: result.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});