const express = require('express');
const cors = require('cors');
const healthController = require('./controllers/healthController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure DNS to prefer IPv4
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// Main route
app.get('/', healthController.getInfo);

// Health check endpoints
app.get('/health', healthController.getOverallHealth);
app.get('/api', healthController.getApiHealth);
app.get('/db', healthController.getDatabaseHealth);
app.get('/auth', healthController.getAuthHealth);

// Backward compatibility route with category parameter
app.get('/health/:category', healthController.getCategoryHealth);
app.get('/health', (req, res) => {
    const category = req.query.category;
    if (category) {
        return healthController.getCategoryHealth(req, res);
    }
    return healthController.getOverallHealth(req, res);
});

// Fallback route for unknown paths
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
});

module.exports = app;