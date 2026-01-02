# 🏢 Demo Company Server - Acme Corp API

A **realistic demo backend** that simulates production failure scenarios for testing incident management and monitoring systems.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Failure Modes](#failure-modes)
- [Quick Start](#quick-start)
- [Configuration](#configuration)

---

## 🎯 Overview

This server represents a **real company's production backend** (Acme Corp) that intentionally simulates various failure modes. It's designed to be monitored by incident management systems to demonstrate:

- Automatic incident detection
- AI-powered root cause analysis
- Incident resolution workflows
- Multi-service monitoring capabilities

**Purpose**: Provides a safe, controlled environment to test incident management systems without affecting real production services.

---

## 🛠️ Technologies Used

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js 5.2.1** - Web application framework for RESTful APIs
- **Morgan** - HTTP request logger middleware
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

### Architecture Pattern
- **MVC (Model-View-Controller)** - Separation of concerns
- **RESTful API** - Standard HTTP methods and status codes
- **Middleware Pattern** - Request/response processing pipeline

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Express Application            │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │      Middleware Stack            │  │
│  │  CORS → JSON → Morgan → Custom   │  │
│  └──────────────────────────────────┘  │
│                  │                      │
│  ┌───────────────▼───────────────┐    │
│  │      Route Handlers            │    │
│  │                                │    │
│  │  /health                       │    │
│  │  /api/auth/*                   │    │
│  │  /api/users/*                  │    │
│  │  /api/payments/*               │    │
│  │  /api/admin/*                  │    │
│  └───────────────┬───────────────┘    │
│                  │                      │
│  ┌───────────────▼───────────────┐    │
│  │      Controllers               │    │
│  │                                │    │
│  │  healthController              │    │
│  │  authController                │    │
│  │  userController                │    │
│  │  paymentController             │    │
│  └───────────────┬───────────────┘    │
│                  │                      │
│  ┌───────────────▼───────────────┐    │
│  │   Failure Simulator Service   │    │
│  │                                │    │
│  │  • Configurable failure modes  │    │
│  │  • CPU overload simulation    │    │
│  │  • Memory leak simulation      │    │
│  │  • Network timeout simulation  │    │
│  └───────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Directory Structure

```
demo-company-server/
├── src/
│   ├── server.js              # Entry point
│   ├── app.js                 # Express app setup & routes
│   ├── services/
│   │   └── failureSimulator.js  # Failure mode control logic
│   └── controllers/
│       ├── healthController.js  # Health check endpoint
│       ├── authController.js    # Authentication endpoints
│       ├── userController.js    # User endpoints
│       └── paymentController.js # Payment endpoints
├── package.json
├── .env.example
└── README.md
```

---

## ⚙️ How It Works

### 1. Server Initialization

```javascript
// server.js starts Express app
const app = require("./app");
app.listen(PORT, () => {
  console.log("🏢 Acme Corp API Server running");
});
```

### 2. Request Flow

```
Client Request
    ↓
Middleware Stack (CORS, JSON parsing, logging)
    ↓
Route Handler
    ↓
Controller
    ↓
Failure Simulator (checks if failures enabled)
    ↓
Response (success or simulated failure)
```

### 3. Failure Simulation Process

1. **Admin enables failure mode** via `/api/admin/failure-mode`
2. **Failure Simulator** stores configuration in memory
3. **Controllers** check failure mode before processing
4. **Failures occur** based on configured rates/intensity
5. **Logs generated** and errors returned to client
6. **Monitoring system** detects issues and creates incidents

### 4. Health Check Mechanism

- Returns service status (healthy/unhealthy)
- Includes response time metrics
- Reports memory usage
- Lists active failure modes
- Used by monitoring systems for incident detection

---

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Health check endpoint (monitoring systems use this)
  - Returns: `{ status, responseTime, memory, activeFailureModes }`

### Authentication
- **POST** `/api/auth/login` - User login
  - Body: `{ username, password }`
  - Returns: `{ success, token, user }`
- **GET** `/api/auth/verify` - Verify authentication token
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ valid, user }`

### Users
- **GET** `/api/users` - List all users
  - Returns: `{ users: [], total, page, limit }`
- **GET** `/api/users/:id` - Get user by ID
  - Returns: `{ id, name, email, role, createdAt }`

### Payments
- **POST** `/api/payments/process` - Process payment (simulates external dependency)
  - Body: `{ amount, cardNumber }`
  - Returns: `{ success, transactionId, amount, status }`

### Admin (Failure Simulation Control)
- **GET** `/api/admin/failure-mode` - Get current failure mode status
- **POST** `/api/admin/failure-mode` - Enable/configure failure mode
  - Body: `{ mode, config: { enabled, failureRate/intensity } }`
- **POST** `/api/admin/reset` - Reset all failure modes

---

## 🔴 Failure Modes

### 1. Authentication Failures

**What it simulates**: Auth service overload, token validation failures

**Configuration**:
```json
{
  "mode": "auth",
  "config": {
    "enabled": true,
    "failureRate": 0.7
  }
}
```

**Behavior**: 70% of authentication requests fail with 401 errors

**Monitoring detects**: Spike in 401 errors, error logs

---

### 2. Database Errors

**What it simulates**: DB connection pool exhaustion, query timeouts

**Configuration**:
```json
{
  "mode": "database",
  "config": {
    "enabled": true,
    "failureRate": 0.5
  }
}
```

**Behavior**: 50% of database queries timeout or fail

**Monitoring detects**: Slow API responses (2s+ delay), 500 errors

---

### 3. CPU Overload

**What it simulates**: CPU-intensive operations, traffic spikes

**Configuration**:
```json
{
  "mode": "cpu",
  "config": {
    "enabled": true,
    "intensity": 8
  }
}
```

**Behavior**: Response times increase significantly (intensity × 50ms delay)

**Monitoring detects**: Response time threshold breached (>1s), health check failures

---

### 4. Memory Leak

**What it simulates**: Objects not being released, cache growing infinitely

**Configuration**:
```json
{
  "mode": "memory",
  "config": {
    "enabled": true,
    "leakRate": 5
  }
}
```

**Behavior**: Memory usage increases with each request (5MB per request)

**Monitoring detects**: Increasing memory usage, health check shows memory warnings (>500MB)

---

### 5. Network Timeouts

**What it simulates**: External dependency failures (payment gateway, third-party APIs)

**Configuration**:
```json
{
  "mode": "network",
  "config": {
    "enabled": true,
    "timeout": true
  }
}
```

**Behavior**: External API calls timeout after 5 seconds

**Monitoring detects**: Timeout errors (503), upstream service failure logs

---

### 6. Configuration Errors

**What it simulates**: Bad environment variables, wrong config after deployment

**Configuration**:
```json
{
  "mode": "config",
  "config": {
    "enabled": true
  }
}
```

**Behavior**: Health check returns 500 with configuration error message

**Monitoring detects**: Health check failures, configuration error logs

---

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Start Server

```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Server runs on `http://localhost:3001` (configurable via PORT env variable)

### Test Health Check

```bash
curl http://localhost:3001/health
```

### Enable a Failure Mode

```bash
curl -X POST http://localhost:3001/api/admin/failure-mode \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "auth",
    "config": {
      "enabled": true,
      "failureRate": 0.7
    }
  }'
```

### Reset All Failures

```bash
curl -X POST http://localhost:3001/api/admin/reset
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```bash
PORT=3001
```

### Running Multiple Instances

You can run multiple instances on different ports:

```bash
# Terminal 1
PORT=3001 npm start

# Terminal 2
PORT=3002 npm start

# Terminal 3
PORT=3003 npm start
```

Then register each in the incident management system's Services page.

---

## 📊 Logs

The server produces realistic logs that monitoring systems can analyze:

```
[INFO] GET /health - 200 (50ms)
[ERROR] POST /api/auth/login - 401 (150ms)
[WARN] GET /api/users - 500 (2034ms)
[AUTH] Authentication failure simulated
[DATABASE] Query timeout - connection pool exhausted
[PAYMENT] External payment gateway timeout
[HEALTH CHECK] UNHEALTHY - Response time: 2543ms, Memory: 523MB
```

---

## 🔗 Integration with Incident Management System

1. **Register service** in the incident management system's Services page
2. **Monitoring service** automatically checks `/health` endpoint every 5 minutes
3. **When failures occur**, incidents are created automatically
4. **AI analyzes** incidents and suggests root causes
5. **Engineers view** and resolve incidents through the dashboard

---

## 📝 Notes

- **This is a demo server** - not for production use
- **Failures are intentional** - designed for testing
- **No real data** - all endpoints return mock data
- **Configurable** - enable/disable failures via API
- **Safe to test** - failures don't affect real systems

---

## 🎯 Use Cases

- Testing incident management systems
- Demonstrating monitoring capabilities
- Training engineers on incident response
- Simulating production-like failure scenarios
- Validating AI-powered root cause analysis

---

**Built for demonstrating incident management and monitoring capabilities** 🚀
