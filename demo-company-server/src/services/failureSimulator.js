// Failure Simulator Service
// Simulates various failure scenarios for testing the incident management system

// Configuration for failure simulation
// Only DB and Auth simulate failures - API and overall health should always be healthy
const FAILURE_CONFIG = {
    overall: { probability: 0.0, responseTime: 500 },  // Overall health always healthy
    api: { probability: 0.0, responseTime: 300 },     // API always healthy
    db: { probability: 0.15, responseTime: 800 },       // 15% chance of DB failure per check
    auth: { probability: 0.2, responseTime: 200 }       // 20% chance of Auth failure per check
};

// Track recent failures to simulate sustained issues
const recentFailures = new Map();

// Check if a subsystem should fail based on probability
const checkFailure = (subsystem = 'overall') => {
    const config = FAILURE_CONFIG[subsystem] || FAILURE_CONFIG.overall;
    const currentTime = Date.now();
    
    // Check if this subsystem is in a sustained failure state
    if (recentFailures.has(subsystem)) {
        const failureInfo = recentFailures.get(subsystem);
        
        // If failure duration hasn't expired, continue failing
        if (currentTime - failureInfo.startTime < failureInfo.duration) {
            return {
                shouldFail: true,
                failureReason: failureInfo.reason,
                responseTime: config.responseTime + Math.floor(Math.random() * 500)
            };
        } else {
            // Duration expired, remove from recent failures
            recentFailures.delete(subsystem);
        }
    }
    
    // Calculate if this request should fail based on probability
    const shouldFail = Math.random() < config.probability;
    
    if (shouldFail) {
        // Randomly select a failure reason
        const failureReasons = [
            'Service temporarily overloaded',
            'Resource constraint detected',
            'External dependency timeout',
            'Memory allocation error',
            'Connection pool exhausted',
            'Rate limiting threshold exceeded',
            'Network connectivity issue',
            'Configuration error detected',
            'Authentication server unreachable',
            'Database connection failed'
        ];
        
        const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
        
        // Sometimes create sustained failures (20% of the time)
        if (Math.random() < 0.2) {
            const duration = 30000 + Math.floor(Math.random() * 60000); // 30-90 seconds
            recentFailures.set(subsystem, {
                startTime: currentTime,
                duration: duration,
                reason: reason
            });
        }
        
        return {
            shouldFail: true,
            failureReason: reason,
            responseTime: config.responseTime + Math.floor(Math.random() * 500)
        };
    }
    
    return {
        shouldFail: false,
        failureReason: null,
        responseTime: Math.floor(Math.random() * config.responseTime / 2) + 10
    };
};

// Force a failure for a specific subsystem (for testing purposes)
const forceFailure = (subsystem, duration = 30000, reason = 'Forced failure for testing') => {
    recentFailures.set(subsystem, {
        startTime: Date.now(),
        duration: duration,
        reason: reason
    });
};

// Clear all forced failures
const clearFailures = () => {
    recentFailures.clear();
};

// Get current failure statistics
const getFailureStats = () => {
    const stats = {};
    Object.keys(FAILURE_CONFIG).forEach(subsystem => {
        stats[subsystem] = {
            configuredProbability: FAILURE_CONFIG[subsystem].probability,
            currentlyFailing: recentFailures.has(subsystem),
            ...(recentFailures.has(subsystem) && {
                remainingDuration: Math.max(0, recentFailures.get(subsystem).duration - 
                    (Date.now() - recentFailures.get(subsystem).startTime))
            })
        };
    });
    return stats;
};

// Reset failure simulation to initial state
const reset = () => {
    recentFailures.clear();
};

module.exports = {
    checkFailure,
    forceFailure,
    clearFailures,
    getFailureStats,
    reset
};