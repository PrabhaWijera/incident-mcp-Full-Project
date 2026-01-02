const failureSimulator = require("../services/failureSimulator");

/**
 * List users endpoint - simulates database query
 */
async function list(req, res) {
  // Simulate CPU overload
  await failureSimulator.simulateCpuOverload();

  // Simulate memory leak
  failureSimulator.simulateMemoryLeak();

  // Check for database failure
  if (failureSimulator.shouldFail("database", failureSimulator.getCurrentMode().database?.failureRate || 0)) {
    console.log("[DATABASE] Query timeout - connection pool exhausted");
    return res.status(500).json({
      error: "Database error",
      message: "Query timeout - database connection pool exhausted",
      timestamp: new Date().toISOString()
    });
  }

  // Simulate slow database query
  const delay = failureSimulator.getCurrentMode().database?.enabled ? 2000 : 50;
  await new Promise(resolve => setTimeout(resolve, delay));

  res.json({
    users: [
      { id: 1, name: "John Doe", email: "john@acmecorp.com", role: "admin" },
      { id: 2, name: "Jane Smith", email: "jane@acmecorp.com", role: "user" },
      { id: 3, name: "Bob Johnson", email: "bob@acmecorp.com", role: "user" }
    ],
    total: 3,
    page: 1,
    limit: 10
  });
}

/**
 * Get user by ID - simulates database lookup
 */
async function getById(req, res) {
  const { id } = req.params;

  // Simulate CPU overload
  await failureSimulator.simulateCpuOverload();

  // Check for database failure
  if (failureSimulator.shouldFail("database", failureSimulator.getCurrentMode().database?.failureRate || 0)) {
    console.log(`[DATABASE] Failed to fetch user ${id} - connection error`);
    return res.status(500).json({
      error: "Database error",
      message: "Database connection failed - unable to retrieve user",
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    id: parseInt(id),
    name: "Demo User",
    email: "user@acmecorp.com",
    role: "user",
    createdAt: new Date().toISOString()
  });
}

module.exports = {
  list,
  getById
};

