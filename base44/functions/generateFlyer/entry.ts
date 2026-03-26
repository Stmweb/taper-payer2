import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { prompt, existing_image_urls } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const enhancedPrompt = `You are a multilingual AI that understands prompts in any language including French. Important context: "recharge", "recharger", "top-up", "top up", "recharger le téléphone", or any similar phrase means adding airtime credit or calling minutes to a mobile phone. Based on the following prompt, generate a professional marketing flyer image: ${prompt}`;
    const payload = { prompt: enhancedPrompt };
    if (existing_image_urls && existing_image_urls.length > 0) {
      payload.existing_image_urls = existing_image_urls;
    }
    const result = await base44.asServiceRole.integrations.Core.GenerateImage(payload);

    return Response.json({ url: result.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});