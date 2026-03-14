Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { phoneNumber, amount, countryCode } = body;

    if (!phoneNumber || !amount || !countryCode) {
      return Response.json({ 
        error: "Missing required fields: phoneNumber, amount, countryCode" 
      }, { status: 400 });
    }

    // Process transaction - simulating payment gateway integration
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return Response.json({
      success: true,
      transactionId,
      phoneNumber,
      amount: parseFloat(amount),
      countryCode,
      status: "completed",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});