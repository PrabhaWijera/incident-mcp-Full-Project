# Running Multiple Demo Servers

## Overview

You can run multiple instances of the demo company server to simulate a multi-service environment. Each instance represents a different service in your company.

## Method 1: Different Ports

### Terminal 1 - Acme Corp API (Port 3001)
```bash
cd demo-company-server
PORT=3001 npm start
```

### Terminal 2 - Beta Corp API (Port 3002)
```bash
cd demo-company-server
PORT=3002 npm start
```

### Terminal 3 - Gamma Corp API (Port 3003)
```bash
cd demo-company-server
PORT=3003 npm start
```

Then register each in the Services page:
- Name: "Acme Corp API", URL: "http://localhost:3001"
- Name: "Beta Corp API", URL: "http://localhost:3002"
- Name: "Gamma Corp API", URL: "http://localhost:3003"

## Method 2: Copy Directory (For Different Configs)

1. Copy the demo-company-server directory:
```bash
cp -r demo-company-server demo-company-server-2
cp -r demo-company-server demo-company-server-3
```

2. Update package.json names if needed
3. Run each on different ports
4. Register all in the Services page

## Registering in Incident Management System

1. Go to **Services** page in the frontend
2. Click **"Add Service"**
3. Enter service details:
   - Name: Service name (e.g., "Acme Corp API")
   - URL: Service URL (e.g., "http://localhost:3001")
   - Health Endpoint: "/health" (default)
   - Category: Choose appropriate category
   - Environment: Production/Staging/Development

4. Click **"Register Service"**

The monitoring service will now check this service every 5 minutes!

## Testing Multiple Services

1. Register multiple services
2. Enable different failure modes on each:
   ```bash
   # Service 1 - CPU overload
   curl -X POST http://localhost:3001/api/admin/failure-mode \
     -H "Content-Type: application/json" \
     -d '{"mode": "cpu", "config": {"enabled": true, "intensity": 8}}'
   
   # Service 2 - Database errors
   curl -X POST http://localhost:3002/api/admin/failure-mode \
     -H "Content-Type: application/json" \
     -d '{"mode": "database", "config": {"enabled": true, "failureRate": 0.7}}'
   
   # Service 3 - Auth failures
   curl -X POST http://localhost:3003/api/admin/failure-mode \
     -H "Content-Type: application/json" \
     -d '{"mode": "auth", "config": {"enabled": true, "failureRate": 0.5}}'
   ```

3. Watch incidents being created for each service
4. Filter incidents by service in the dashboard

Perfect for demonstrating multi-service monitoring! 🚀

