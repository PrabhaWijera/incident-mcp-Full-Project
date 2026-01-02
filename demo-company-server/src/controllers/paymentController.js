const failureSimulator = require("../services/failureSimulator");

/**
 * Process payment endpoint - simulates external dependency (payment gateway)
 */
async function process(req, res) {
  const { amount, cardNumber } = req.body;

  // Simulate CPU overload
  await failureSimulator.simulateCpuOverload();

  // Simulate memory leak
  failureSimulator.simulateMemoryLeak();

  // Check for network timeout (external payment gateway)
  if (failureSimulator.getCurrentMode().network?.timeout) {
    try {
      await failureSimulator.simulateNetworkTimeout();
    } catch (error) {
      console.log("[PAYMENT] External payment gateway timeout");
      return res.status(503).json({
        error: "Payment gateway unavailable",
        message: "External payment service timeout - please try again later",
        timestamp: new Date().toISOString()
      });
    }
  }

  // Check for database failure
  if (failureSimulator.shouldFail("database", failureSimulator.getCurrentMode().database?.failureRate || 0)) {
    console.log("[PAYMENT] Database error during payment processing");
    return res.status(500).json({
      error: "Database error",
      message: "Unable to process payment - database connection error",
      timestamp: new Date().toISOString()
    });
  }

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 100));

  res.json({
    success: true,
    transactionId: `txn_${Date.now()}`,
    amount: amount,
    status: "completed",
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  process
};

