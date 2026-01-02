const failureSimulator = require("../services/failureSimulator");

/**
 * Health check endpoint
 * Monitoring systems call this to check server health
 */
async function checkHealth(req, res) {
  const startTime = Date.now();
  const failureMode = failureSimulator.getCurrentMode();

  // Simulate CPU overload if enabled
  if (failureMode.cpu?.enabled) {
    await failureSimulator.simulateCpuOverload();
  }

  // Simulate config error if enabled
  if (failureMode.config?.enabled) {
    return res.status(500).json({
      status: "unhealthy",
      error: "Configuration error - invalid environment settings",
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    });
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = {
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    rss: Math.round(memoryUsage.rss / 1024 / 1024)
  };

  // Memory leak detection threshold (500MB)
  const isMemoryLeak = memoryUsageMB.heapUsed > 500;

  const responseTime = Date.now() - startTime;
  const isHealthy = responseTime < 1000 && !isMemoryLeak && !failureMode.config?.enabled;

  // Log health check
  if (!isHealthy) {
    console.log(`[HEALTH CHECK] UNHEALTHY - Response time: ${responseTime}ms, Memory: ${memoryUsageMB.heapUsed}MB`);
  }

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    responseTime: responseTime,
    memory: memoryUsageMB,
    activeFailureModes: Object.keys(failureMode).filter(key => failureMode[key]?.enabled),
    message: isHealthy 
      ? "Service is operating normally"
      : `Service degradation detected - Response time: ${responseTime}ms${isMemoryLeak ? ", Memory leak detected" : ""}`
  });
}

module.exports = {
  checkHealth
};

