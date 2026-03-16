Deno.serve(async (req) => {
  try {
    const { from, to } = await req.json();

    if (!from || !to) {
      return Response.json({ error: 'Missing from or to currency' }, { status: 400 });
    }

    // Use open.er-api.com — free, no auth required
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    if (data?.result === 'success' && data?.rates?.[to]) {
      const rate = data.rates[to];
      return Response.json({ rate, source: 'er-api' });
    }

    // Fallback hardcoded rate
    return Response.json({ rate: 130, source: 'fallback' });
  } catch (error) {
    console.error('Exchange rate error:', error.message);
    return Response.json({ rate: 130, source: 'fallback' }, { status: 200 });
  }
});