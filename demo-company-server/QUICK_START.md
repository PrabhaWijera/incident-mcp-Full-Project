# Quick Start Guide

## 🚀 Start the Demo Server

```bash
cd demo-company-server
npm install  # Already done
npm start
```

Server runs on `http://localhost:3001`

## 🧪 Test the Server

### 1. Check if server is running:
```bash
curl http://localhost:3001/health
```

### 2. Enable a failure mode (Authentication failures):
```bash
curl -X POST http://localhost:3001/api/admin/failure-mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "auth", "config": {"enabled": true, "failureRate": 0.7}}'
```

### 3. Try to login (will fail):
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "test"}'
```

### 4. Check health (should show failure mode active):
```bash
curl http://localhost:3001/health
```

### 5. Reset failures:
```bash
curl -X POST http://localhost:3001/api/admin/reset
```

## 🔗 Connect to Incident Management System

Your incident management system should monitor:
- Health endpoint: `http://localhost:3001/health`
- Watch for errors in logs
- Track response times

The monitoring service will automatically create incidents when failures are detected!

## 📝 Example Failure Scenarios

### Scenario 1: Database Errors
```bash
curl -X POST http://localhost:3001/api/admin/failure-mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "database", "config": {"enabled": true, "failureRate": 0.5}}'

# Test it
curl http://localhost:3001/api/users
```

### Scenario 2: CPU Overload
```bash
curl -X POST http://localhost:3001/api/admin/failure-mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "cpu", "config": {"enabled": true, "intensity": 8}}'

# Test it
curl http://localhost:3001/health
```

### Scenario 3: Multiple Failures
```bash
# Enable CPU overload
curl -X POST http://localhost:3001/api/admin/failure-mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "cpu", "config": {"enabled": true, "intensity": 5}}'

# Enable database errors
curl -X POST http://localhost:3001/api/admin/failure-mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "database", "config": {"enabled": true, "failureRate": 0.6}}'

# Now try various endpoints - they will all be affected!
```

## 🎯 What to Expect

When you enable failure modes:
1. **Your monitoring system** will detect the issues
2. **Incidents will be created** automatically
3. **AI will analyze** the incidents
4. **You can view** everything in the incident management dashboard

Perfect for demonstrating your incident management system! 🚀

