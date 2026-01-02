# 🏗️ System Architecture & Process Flow

Complete documentation of the AI-Powered Incident Management System architecture and step-by-step process flows.

---

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Process Flows](#process-flows)
- [Technology Stack](#technology-stack)

---

## 🎯 System Overview

The AI-Powered Incident Management System is a **full-stack application** that:

1. **Monitors** multiple company services automatically
2. **Detects** issues and creates incidents
3. **Analyzes** incidents using AI (NVIDIA NIM LLMs)
4. **Provides** root cause analysis and suggestions
5. **Manages** incident resolution workflows

**Key Principle**: Engineers stay in control - AI provides analysis and suggestions, but all actions are read-only for AI.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │   Dashboard    │  │  Incidents     │  │   Services     │  │
│  │   (Next.js)    │  │   List Page    │  │  Management     │  │
│  │                │  │                │  │                │  │
│  │ • Statistics   │  │ • Filtering    │  │ • Register     │  │
│  │ • Overview     │  │ • Search       │  │ • Enable/Disable│ │
│  │ • Real-time    │  │ • Real-time    │  │ • Test Health  │  │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘  │
│           │                   │                   │           │
│           └───────────────────┴───────────────────┘           │
│                           │                                      │
│                  ┌───────▼────────┐                            │
│                  │   API Client   │                            │
│                  │   (Axios)      │                            │
│                  │   TypeScript    │                            │
│                  └───────┬────────┘                            │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTP/REST
                           │ JSON
┌──────────────────────────▼──────────────────────────────────────┐
│                    API LAYER (Express.js)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Middleware Stack                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │  │
│  │  │   CORS   │→ │   JSON   │→ │ Security │→ │ Routes   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌───────────────────────▼─────────────────────────────────┐  │
│  │                    Route Handlers                         │  │
│  │                                                            │  │
│  │  /api/incidents    →  Incident Management                │  │
│  │  /api/services     →  Service Management                 │  │
│  │  /api/ai           →  AI Analysis Endpoints              │  │
│  │  /api/logs         →  Log Retrieval                       │  │
│  │  /api/system       →  System Stats & Events              │  │
│  │                                                            │  │
│  └───────────────────────┬─────────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────────┘
                             │
┌───────────────────────────▼──────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                            │
│                                                                    │
│  ┌────────────────────────┐    ┌─────────────────────────┐    │
│  │   AI Controller        │    │  Monitoring Service      │    │
│  │                        │    │  (Background Process)    │    │
│  │ • Severity Analysis    │    │                         │    │
│  │ • Category Analysis    │    │ • Health Checks         │    │
│  │ • Root Cause Analysis  │    │ • Event Detection       │    │
│  │ • Action Generation    │    │ • Auto-Resolution       │    │
│  └──────────┬─────────────┘    └─────────────────────────┘    │
│             │                                                   │
│  ┌──────────▼─────────────┐                                     │
│  │   NVIDIA NIM Client    │                                     │
│  │                        │                                     │
│  │  Primary: Llama 3.1    │                                     │
│  │  Backup: Mistral 7B    │                                     │
│  │  Fallback: Rules       │                                     │
│  └────────────────────────┘                                     │
└────────────────────────────┬──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                        DATA LAYER                                 │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐      │
│  │                    MongoDB Database                     │      │
│  │                                                          │      │
│  │  ┌──────────────────┐        ┌──────────────────┐      │      │
│  │  │  Incidents       │        │  Logs            │      │      │
│  │  │  Collection      │        │  Collection      │      │      │
│  │  │                  │        │                  │      │      │
│  │  │ • Title          │        │ • Message        │      │      │
│  │  │ • Description    │        │ • Level          │      │      │
│  │  │ • Status         │        │ • Timestamp     │      │      │
│  │  │ • Severity       │        │ • IncidentID     │      │      │
│  │  │ • Category       │        │                  │      │      │
│  │  │ • ServiceID      │        │                  │      │      │
│  │  │ • AI Analysis    │        │                  │      │      │
│  │  │ • Timeline       │        │                  │      │      │
│  │  └──────────────────┘        └──────────────────┘      │      │
│  │                                                          │      │
│  │  ┌──────────────────┐                                 │      │
│  │  │  Services         │                                 │      │
│  │  │  Collection       │                                 │      │
│  │  │                    │                                 │      │
│  │  │ • Name             │                                 │      │
│  │  │ • URL              │                                 │      │
│  │  │ • HealthEndpoint   │                                 │      │
│  │  │ • Category         │                                 │      │
│  │  │ • Enabled          │                                 │      │
│  │  │ • Metadata         │                                 │      │
│  │  └──────────────────┘                                 │      │
│  │                                                          │      │
│  └────────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Architecture

### Frontend Components

```
App (Next.js)
├── Layout
│   └── Navigation
├── Dashboard (/)
│   ├── StatsCard (x4)
│   ├── IncidentCard (x5)
│   └── EventSimulator
├── Incidents (/incidents)
│   ├── IncidentCard (List)
│   └── Filters
├── Incident Detail (/incidents/[id])
│   ├── Incident Info
│   ├── AI Analysis Card
│   │   ├── Root Cause
│   │   └── Suggested Actions
│   ├── Timeline
│   └── Logs Viewer
└── Services (/services)
    ├── Service List
    ├── Add Service Form
    └── Service Actions
```

### Backend Structure

```
ai-incident-assistant/
├── src/
│   ├── server.js (Entry Point)
│   ├── app.js (Express Setup)
│   │
│   ├── config/
│   │   └── db.js (MongoDB Connection)
│   │
│   ├── models/
│   │   ├── Incident.js
│   │   ├── Log.js
│   │   └── Service.js
│   │
│   ├── api/
│   │   ├── incident.routes.js
│   │   ├── service.routes.js
│   │   ├── ai.routes.js
│   │   ├── log.routes.js
│   │   └── system.routes.js
│   │
│   ├── huggins/
│   │   ├── ai.controller.js (Main Logic)
│   │   └── huggingface.client.js (NVIDIA NIM)
│   │
│   ├── services/
│   │   └── monitoring.service.js
│   │
│   └── middleware/
│       └── toolGuard.js
```

---

## 🔄 Data Flow

### Service Registration Flow

```
Engineer → Frontend (Services Page)
    ↓
POST /api/services
    ↓
Backend validates & saves to MongoDB
    ↓
Service Collection
    ↓
Monitoring Service picks up new service
    ↓
Starts monitoring on next cycle
```

### Incident Detection Flow

```
Monitoring Service (Every 5 minutes)
    ↓
Fetch enabled services from DB
    ↓
For each service:
    GET {service.url}/health
    ↓
Check response:
    - Status code
    - Response time
    - Health data
    ↓
If unhealthy:
    Create Incident in MongoDB
    Add Log entry
    Link to Service
    ↓
Frontend auto-refreshes
    ↓
Engineer sees new incident
```

### AI Analysis Flow

```
Engineer clicks "Run AI Analysis"
    ↓
Frontend → GET /api/ai/analysis/:incidentId
    ↓
Backend:
    1. Fetch incident & logs
    2. Prepare prompts
    3. Call NVIDIA NIM API
       a. Try Llama 3.1 (primary)
       b. Try Mistral 7B (secondary)
       c. Fallback to rule-based
    4. Analyze:
       - Severity
       - Category
       - Root Cause
    5. Generate suggestions
    6. Update incident in DB
    ↓
Return results to frontend
    ↓
Display AI analysis in UI
```

---

## 📊 Process Flows

### Process 1: Service Registration & Monitoring

```
Step 1: Engineer registers service
├── Navigate to Services page
├── Fill form: name, URL, health endpoint, category
└── Click "Register Service"

Step 2: Service saved to database
├── Backend validates input
├── Checks for duplicate URLs
├── Creates Service document in MongoDB
└── Returns success response

Step 3: Monitoring service detects new service
├── Monitoring service runs every 5 minutes
├── Fetches all enabled services from DB
├── Adds new service to monitoring list
└── Starts health checks

Step 4: Continuous monitoring
├── Every 5 minutes: GET {service.url}/health
├── Analyze response
├── If healthy: Continue monitoring
└── If unhealthy: Create incident
```

### Process 2: Incident Detection & Creation

```
Step 1: Service becomes unhealthy
├── Demo server failure mode enabled
├── Health endpoint returns unhealthy status
└── Or service becomes unreachable

Step 2: Monitoring service detects issue
├── Health check fails
├── Response time exceeds threshold
├── Or connection error occurs
└── Determines severity and category

Step 3: Incident created automatically
├── Create Incident document in MongoDB
├── Set status: "open"
├── Link to service via serviceId
├── Add initial log entry
└── Create timeline event

Step 4: Frontend displays incident
├── Auto-refresh detects new incident
├── Appears in dashboard
├── Shows in incidents list
└── Engineer can view details
```

### Process 3: AI Analysis Request

```
Step 1: Engineer views incident
├── Navigate to incident detail page
├── Review incident information
├── Check logs and timeline
└── Click "Run AI Analysis" button

Step 2: Backend processes request
├── Fetch incident from database
├── Fetch associated logs
├── Prepare analysis prompts
└── Call NVIDIA NIM API

Step 3: AI analysis execution
├── Try primary model (Llama 3.1)
│   ├── Success → Use results
│   └── Failure → Try secondary
├── Try secondary model (Mistral 7B)
│   ├── Success → Use results
│   └── Failure → Use rule-based
└── Rule-based fallback
    └── Pattern matching analysis

Step 4: Results stored and returned
├── Update incident with AI analysis
├── Store root cause and probability
├── Generate suggested actions
├── Link related incidents
└── Return to frontend

Step 5: Frontend displays results
├── Show root cause with confidence
├── Display suggested actions
├── Show AI model information
└── Engineer reviews and acts
```

### Process 4: Incident Resolution

```
Step 1: Engineer investigates
├── Review incident details
├── Check AI analysis results
├── Review logs and timeline
└── Understand root cause

Step 2: Engineer fixes issue
├── Fix service issue (e.g., reset demo server)
├── Or resolve underlying problem
└── Verify service is healthy

Step 3: Engineer updates incident
├── Navigate to incident detail
├── Click "Mark as Resolved"
├── Add resolution notes (optional)
└── Update status to "resolved"

Step 4: System updates
├── Update incident status in DB
├── Add timeline event
├── Calculate resolution time
└── Update statistics

Step 5: Monitoring verifies
├── Next health check confirms service healthy
├── If auto-resolve enabled, system confirms
└── Incident remains resolved
```

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16.1.1** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js 5.2.1** - Web framework
- **MongoDB** - Database
- **Mongoose 9.0.2** - ODM

### AI/ML
- **NVIDIA NIM API** - LLM inference
- **Llama 3.1 8B Instruct** - Primary model
- **Mistral 7B Instruct** - Secondary model

### Infrastructure
- **MongoDB** - Data persistence
- **RESTful API** - Communication protocol
- **CORS** - Cross-origin support

---

## 🔐 Security & Best Practices

### Security
- **CORS** enabled for frontend-backend communication
- **Input validation** on all API endpoints
- **Error handling** prevents information leakage
- **Read-only AI** - AI never executes actions

### Best Practices
- **Separation of concerns** - Clear layer boundaries
- **Error handling** - Graceful degradation
- **Logging** - Comprehensive logging for debugging
- **Type safety** - TypeScript on frontend
- **Fallback mechanisms** - Multiple layers of fallbacks

---

**Complete system architecture for enterprise-scale incident management** 🚀

