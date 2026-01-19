const failureSimulator = require('../services/failureSimulator');

// Service information
const getInfo = (req, res) => {
    res.json({
        service: 'Demo Company Server',
        version: '1.0.0',
        description: 'Simulated production service for testing incident management system',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            api: '/api',
            db: '/db',
            auth: '/auth'
        }
    });
};

// Overall health check - Always healthy (only DB and Auth can fail)
const getOverallHealth = (req, res) => {
    // Check subsystem statuses
    const apiStatus = getSubsystemStatus('api');
    const dbStatus = getSubsystemStatus('db');
    const authStatus = getSubsystemStatus('auth');

    // Overall is healthy even if DB/Auth fail (since API is always healthy)
    // But we show degraded status if DB or Auth fail
    const hasFailures = dbStatus.status === 'unhealthy' || authStatus.status === 'unhealthy';
    const overallStatus = hasFailures ? 'degraded' : 'healthy';

    res.status(overallStatus === 'healthy' ? 200 : 200).json({
        status: overallStatus,
        message: overallStatus === 'healthy' 
            ? 'All systems operational' 
            : 'Some subsystems degraded (DB or Auth issues detected)',
        timestamp: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 50) + 10,
        subsystems: {
            api: apiStatus,
            database: dbStatus,
            auth: authStatus
        }
    });
};

// API subsystem health - Always healthy
const getApiHealth = (req, res) => {
    res.status(200).json({
        status: 'healthy',
        category: 'api',
        message: 'API subsystem is operational - All API endpoints functioning normally',
        responseTime: Math.floor(Math.random() * 50) + 10,
        timestamp: new Date().toISOString(),
        subsystems: {
            auth: {
                healthy: true,
                message: 'Authentication service operating normally'
            },
            users: {
                healthy: true,
                message: 'Users service operating normally'
            },
            payments: {
                healthy: true,
                message: 'Payments service operating normally'
            }
        },
        summary: {
            totalSubsystems: 3,
            healthySubsystems: 3,
            degradedSubsystems: 0
        }
    });
};

// Database subsystem health - Can fail (simulated errors)
const getDatabaseHealth = (req, res) => {
    const { shouldFail, failureReason, responseTime } = failureSimulator.checkFailure('db');
    
    if (shouldFail) {
        return res.status(503).json({
            status: 'unhealthy',
            category: 'database',
            message: failureReason || 'Database connection failed - Connection pool exhausted, query timeouts detected',
            timestamp: new Date().toISOString(),
            connection: {
                status: 'disconnected',
                latency: responseTime || 5000,
                errorRate: 0.85,
                poolSize: 2,
                activeQueries: 150,
                replicationLag: 500
            }
        });
    }

    res.status(200).json({
        status: 'healthy',
        category: 'database',
        message: 'Database connection healthy - Connection pool active, all replicas synchronized',
        timestamp: new Date().toISOString(),
        connection: {
            status: 'connected',
            latency: Math.floor(Math.random() * 100) + 20,
            errorRate: 0,
            poolSize: Math.floor(Math.random() * 20) + 10,
            activeQueries: Math.floor(Math.random() * 50) + 10,
            replicationLag: 0
        }
    });
};

// Authentication subsystem health - Can fail (simulated errors)
const getAuthHealth = (req, res) => {
    const { shouldFail, failureReason, responseTime } = failureSimulator.checkFailure('auth');
    
    if (shouldFail) {
        return res.status(503).json({
            status: 'unhealthy',
            category: 'auth',
            message: failureReason || 'Authentication service is unhealthy - Token validation failures detected, OAuth providers unreachable',
            timestamp: new Date().toISOString(),
            auth: {
                healthy: false,
                failureRate: 0.75,
                databaseConnected: false,
                networkAvailable: false,
                responseTime: responseTime || 2000,
                activeSessions: Math.floor(Math.random() * 200) + 50,
                tokenValidationRate: 25.0,
                oauthProviders: []
            }
        });
    }

    res.status(200).json({
        status: 'healthy',
        category: 'auth',
        message: 'Authentication service operating normally - Token validation working, all OAuth providers connected',
        timestamp: new Date().toISOString(),
        auth: {
            healthy: true,
            failureRate: 0,
            databaseConnected: true,
            networkAvailable: true,
            responseTime: Math.floor(Math.random() * 30) + 5,
            activeSessions: Math.floor(Math.random() * 500) + 1000,
            tokenValidationRate: 99.9,
            oauthProviders: ['google', 'github', 'microsoft']
        }
    });
};

// Category-specific health check (for backward compatibility)
const getCategoryHealth = (req, res) => {
    const category = req.params.category || req.query.category;
    
    switch (category) {
        case 'api':
            return getApiHealth(req, res);
        case 'db':
            return getDatabaseHealth(req, res);
        case 'auth':
            return getAuthHealth(req, res);
        default:
            return getOverallHealth(req, res);
    }
};

// Helper function to get subsystem status
const getSubsystemStatus = (subsystem) => {
    const { shouldFail } = failureSimulator.checkFailure(subsystem);
    return shouldFail ? { status: 'unhealthy', lastChecked: new Date().toISOString() } : 
                       { status: 'healthy', lastChecked: new Date().toISOString() };
};

module.exports = {
    getInfo,
    getOverallHealth,
    getApiHealth,
    getDatabaseHealth,
    getAuthHealth,
    getCategoryHealth
};