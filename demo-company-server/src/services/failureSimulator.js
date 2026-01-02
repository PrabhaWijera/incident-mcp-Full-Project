/**
 * Failure Simulator Service
 * Controls various failure modes for realistic incident simulation
 */

let currentFailureMode = {
  auth: { enabled: false, failureRate: 0 },
  database: { enabled: false, failureRate: 0 },
  cpu: { enabled: false, intensity: 0 },
  memory: { enabled: false, leakRate: 0 },
  network: { enabled: false, timeout: false },
  config: { enabled: false }
};

let memoryLeakArray = []; // For memory leak simulation
let cpuLoadInterval = null; // For CPU overload simulation

/**
 * Get current failure mode status
 */
function getFailureMode(req, res) {
  res.json({
    currentMode: currentFailureMode,
    instructions: {
      auth: "Set failureRate (0-1) to simulate authentication failures",
      database: "Set failureRate (0-1) to simulate database errors",
      cpu: "Set intensity (1-10) to simulate CPU overload",
      memory: "Set leakRate (MB per request) to simulate memory leak",
      network: "Set timeout: true to simulate external dependency failures",
      config: "Set enabled: true to simulate configuration errors"
    }
  });
}

/**
 * Set failure mode
 */
function setFailureMode(req, res) {
  const { mode, config } = req.body;

  if (!mode || !currentFailureMode[mode]) {
    return res.status(400).json({ error: `Invalid failure mode. Available: ${Object.keys(currentFailureMode).join(", ")}` });
  }

  // Reset previous mode if disabling
  if (config.enabled === false) {
    resetSpecificMode(mode);
  }

  // Apply new configuration
  currentFailureMode[mode] = { ...currentFailureMode[mode], ...config };

  // Initialize mode-specific behavior
  if (config.enabled) {
    initializeFailureMode(mode, config);
  }

  console.log(`[FAILURE SIMULATOR] ${mode} mode ${config.enabled ? "ENABLED" : "DISABLED"}`);
  if (config.enabled) {
    console.log(`[FAILURE SIMULATOR] ${mode} config:`, config);
  }

  res.json({
    message: `Failure mode '${mode}' ${config.enabled ? "enabled" : "disabled"}`,
    currentMode: currentFailureMode[mode]
  });
}

/**
 * Reset all failure modes
 */
function reset(req, res) {
  Object.keys(currentFailureMode).forEach(mode => {
    resetSpecificMode(mode);
  });

  currentFailureMode = {
    auth: { enabled: false, failureRate: 0 },
    database: { enabled: false, failureRate: 0 },
    cpu: { enabled: false, intensity: 0 },
    memory: { enabled: false, leakRate: 0 },
    network: { enabled: false, timeout: false },
    config: { enabled: false }
  };

  console.log("[FAILURE SIMULATOR] All failure modes reset");
  res.json({ message: "All failure modes reset", currentMode: currentFailureMode });
}

/**
 * Reset specific failure mode
 */
function resetSpecificMode(mode) {
  switch (mode) {
    case "memory":
      memoryLeakArray = [];
      if (global.gc) {
        global.gc();
      }
      break;
    case "cpu":
      if (cpuLoadInterval) {
        clearInterval(cpuLoadInterval);
        cpuLoadInterval = null;
      }
      break;
  }
}

/**
 * Initialize failure mode behavior
 */
function initializeFailureMode(mode, config) {
  switch (mode) {
    case "cpu":
      if (!cpuLoadInterval && config.intensity > 0) {
        const loadDuration = config.intensity * 100; // milliseconds
        cpuLoadInterval = setInterval(() => {
          const start = Date.now();
          while (Date.now() - start < loadDuration) {
            Math.random() * Math.random(); // CPU intensive operation
          }
        }, 10);
      }
      break;
    case "memory":
      // Memory leak will be handled per request
      break;
  }
}

/**
 * Check if failure should occur based on mode and rate
 */
function shouldFail(mode, rate = 0) {
  if (!currentFailureMode[mode]?.enabled) {
    return false;
  }
  return Math.random() < rate;
}

/**
 * Simulate CPU overload delay
 */
function simulateCpuOverload() {
  if (!currentFailureMode.cpu?.enabled) {
    return Promise.resolve();
  }

  const intensity = currentFailureMode.cpu.intensity || 0;
  const delay = intensity * 50; // milliseconds

  return new Promise(resolve => {
    const start = Date.now();
    const end = start + delay;
    while (Date.now() < end) {
      Math.random() * Math.random(); // CPU intensive
    }
    resolve();
  });
}

/**
 * Simulate memory leak
 */
function simulateMemoryLeak() {
  if (!currentFailureMode.memory?.enabled) {
    return;
  }

  const leakRate = currentFailureMode.memory.leakRate || 1; // MB per request
  const leakSize = leakRate * 1024 * 1024; // Convert to bytes
  const array = new Array(leakSize / 8).fill(0);
  memoryLeakArray.push(array);

  // Log memory usage
  if (process.memoryUsage) {
    const usage = process.memoryUsage();
    console.log(`[MEMORY LEAK] Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  }
}

/**
 * Simulate network timeout
 */
function simulateNetworkTimeout() {
  if (!currentFailureMode.network?.enabled || !currentFailureMode.network.timeout) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("External dependency timeout - service unavailable"));
    }, 5000);
  });
}

module.exports = {
  getFailureMode,
  setFailureMode,
  reset,
  shouldFail,
  simulateCpuOverload,
  simulateMemoryLeak,
  simulateNetworkTimeout,
  getCurrentMode: () => currentFailureMode
};

