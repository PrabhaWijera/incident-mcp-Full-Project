const failureSimulator = require("../services/failureSimulator");

/**
 * Login endpoint - simulates authentication
 */
async function login(req, res) {
  const { username, password } = req.body;

  // Simulate CPU overload
  await failureSimulator.simulateCpuOverload();

  // Simulate memory leak
  failureSimulator.simulateMemoryLeak();

  // Check for auth failure mode
  if (failureSimulator.shouldFail("auth", failureSimulator.getCurrentMode().auth?.failureRate || 0)) {
    console.log("[AUTH] Authentication failure simulated");
    return res.status(401).json({
      error: "Authentication failed",
      message: "Invalid credentials or authentication service unavailable",
      timestamp: new Date().toISOString()
    });
  }

  // Check for database failure
  if (failureSimulator.shouldFail("database", failureSimulator.getCurrentMode().database?.failureRate || 0)) {
    console.log("[AUTH] Database error during authentication");
    return res.status(500).json({
      error: "Internal server error",
      message: "Database connection timeout - unable to verify credentials",
      timestamp: new Date().toISOString()
    });
  }

  // Simulate network timeout for external auth service
  try {
    await failureSimulator.simulateNetworkTimeout();
  } catch (error) {
    console.log("[AUTH] External authentication service timeout");
    return res.status(503).json({
      error: "Service unavailable",
      message: "External authentication service timeout",
      timestamp: new Date().toISOString()
    });
  }

  // Successful login
  const token = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  res.json({
    success: true,
    token: token,
    user: {
      id: 1,
      username: username,
      email: `${username}@acmecorp.com`
    },
    expiresIn: 3600
  });
}

/**
 * Verify token endpoint
 */
async function verify(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  // Simulate CPU overload
  await failureSimulator.simulateCpuOverload();

  // Check for auth failure mode
  if (failureSimulator.shouldFail("auth", failureSimulator.getCurrentMode().auth?.failureRate || 0)) {
    console.log("[AUTH] Token verification failure");
    return res.status(401).json({
      error: "Invalid token",
      message: "Token validation failed - authentication service error"
    });
  }

  if (!token) {
    return res.status(401).json({
      error: "No token provided"
    });
  }

  res.json({
    valid: true,
    user: {
      id: 1,
      username: "demo_user"
    }
  });
}

module.exports = {
  login,
  verify
};

