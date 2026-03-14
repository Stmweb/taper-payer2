Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { phoneNumber, amount, countryCode } = body;

    // Validate required fields
    if (!phoneNumber || !amount || !countryCode) {
      return Response.json({ 
        error: "Missing required fields: phoneNumber, amount, countryCode" 
      }, { status: 400 });
    }

    // Mock success response for testing
    return Response.json({
      success: true,
      transactionId: `tpay-${Date.now()}`,
      message: `Top-up of $${amount} sent to ${phoneNumber}`,
      status: "processed"
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});