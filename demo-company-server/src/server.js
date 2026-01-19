require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces

console.log(`🚀 Starting Demo Company Server on ${HOST}:${PORT}`);

// Start server
const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Demo Company Server running on http://${HOST}:${PORT}`);
    console.log(`📋 Server endpoints:`);
    console.log(`   GET  /                          - Service information`);
    console.log(`   GET  /health                    - Overall health`);
    console.log(`   GET  /api                       - API subsystem health`);
    console.log(`   GET  /db                        - Database subsystem health`);
    console.log(`   GET  /auth                      - Auth subsystem health`);
    console.log(`   GET  /health?category=X         - Category-specific (backward compat)`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});