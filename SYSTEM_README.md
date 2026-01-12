# AI-Powered Incident Management System
## Technical Overview & Interview Guide

---

## 0. Project Structure & Architecture Diagrams

### Project Folder Structure

```
MCP-concept/
│
├── ai-incident-assistant/          # Backend API Server
│   ├── src/
│   │   ├── server.js               # Entry point, starts Express server
│   │   ├── app.js                  # Express app setup, route registration
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── models/
│   │   │   ├── Incident.js         # Incident database schema
│   │   │   ├── Log.js              # Log database schema
│   │   │   └── Service.js           # Service database schema
│   │   ├── api/
│   │   │   ├── incident.routes.js  # REST: GET/PATCH incidents
│   │   │   ├── service.routes.js   # REST: CRUD services
│   │   │   ├── log.routes.js       # REST: GET logs
│   │   │   ├── system.routes.js    # REST: stats, monitoring control
│   │   │   └── mcp.routes.js       # MCP: JSON-RPC endpoint
│   │   ├── services/
│   │   │   ├── monitoring.service.js    # Background monitoring service
│   │   │   └── aiAnalysis.service.js   # AI analysis orchestration
│   │   ├── nvidia/
│   │   │   ├── navidia.client.js   # NVIDIA NIM API client
│   │   │   └── ai.controller.js    # Legacy REST wrapper (read-only)
│   │   ├── ai/
│   │   │   └── tools.js            # MCP tool implementations (read-only)
│   │   └── middleware/
│   │       └── toolGuard.js       # Security: validates AI tool access
│   └── package.json
│
├── incident-frontend/               # Frontend React Application
│   ├── app/
│   │   ├── page.tsx                # Dashboard (home page)
│   │   ├── incidents/
│   │   │   ├── page.tsx             # Incidents list page
│   │   │   └── [id]/page.tsx       # Incident detail page
│   │   ├── services/
│   │   │   └── page.tsx             # Services management page
│   │   └── guide/
│   │       └── page.tsx             # User guide page
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   ├── IncidentCard.tsx         # Incident display card
│   │   ├── StatsCard.tsx            # Statistics display
│   │   └── EventSimulator.tsx      # (Deprecated) Event simulator
│   ├── lib/
│   │   ├── api.ts                  # API client functions
│   │   ├── types.ts                # TypeScript type definitions
│   │   └── utils.ts                # Utility functions
│   └── package.json
│
├── demo-company-server/             # Demo Service (for testing)
│   ├── src/
│   │   ├── server.js               # Express server entry point
│   │   ├── app.js                  # Express app setup
│   │   ├── controllers/            # API controllers
│   │   └── services/
│   │       └── failureSimulator.js # Simulates failures
│   └── package.json
│
└── SYSTEM_README.md                 # This document

```

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                              │
│                    (Next.js React Application)                       │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Dashboard   │  │  Incidents   │  │   Services   │              │
│  │   Page       │  │   Pages      │  │    Page      │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                      │
│         └──────────────────┼──────────────────┘                      │
│                            │                                          │
│                   ┌────────▼────────┐                                 │
│                   │   lib/api.ts     │                                 │
│                   │  API Client      │                                 │
│                   └────────┬────────┘                                 │
└────────────────────────────┼──────────────────────────────────────────┘
                             │ HTTP Requests
                             │ (REST + MCP JSON-RPC)
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                      BACKEND LAYER                                    │
│                 (Express.js API Server)                                │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Express App (app.js)                       │   │
│  │                                                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │ REST Routes  │  │  MCP Routes  │  │ System Routes│       │   │
│  │  │              │  │              │  │              │       │   │
│  │  │ • Incidents  │  │ • JSON-RPC   │  │ • Stats      │       │   │
│  │  │ • Services   │  │ • Tools      │  │ • Monitoring │       │   │
│  │  │ • Logs       │  │ • Read-only  │  │   Control    │       │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │   │
│  │         │                  │                  │               │   │
│  └─────────┼──────────────────┼──────────────────┼───────────────┘   │
│            │                  │                  │                    │
│  ┌─────────▼──────────┐  ┌───▼──────────────┐  ┌─▼──────────────┐  │
│  │  Business Logic    │  │  MCP Tools       │  │ Monitoring     │  │
│  │                    │  │                  │  │ Service        │  │
│  │  • Status updates  │  │  • getIncident   │  │                │  │
│  │  • Action approval │  │  • getLogs       │  │ • Health checks│  │
│  │  • Service CRUD    │  │  • analyze       │  │ • Auto-resolve │  │
│  └─────────┬──────────┘  └───┬──────────────┘  └─┬──────────────┘  │
│            │                  │                    │                  │
│            └──────────────────┼────────────────────┘                  │
│                               │                                        │
│                    ┌──────────▼──────────┐                            │
│                    │  AI Analysis        │                            │
│                    │  Service            │                            │
│                    │  (Read-only)        │                            │
│                    └──────────┬──────────┘                            │
│                               │                                        │
│                    ┌──────────▼──────────┐                            │
│                    │  NVIDIA NIM Client   │                            │
│                    │  (External API)     │                            │
│                    └─────────────────────┘                            │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    MongoDB Database                          │   │
│  │                                                               │   │
│  │  Collections:                                                 │   │
│  │  • incidents  (incident records)                             │   │
│  │  • logs       (log entries)                                   │   │
│  │  • services   (monitored services)                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP Health Checks
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                    DEMO SERVICES LAYER                                │
│              (Simulated Production Services)                            │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │         Demo Company Server                                   │     │
│  │         (Acme Corp API)                                       │     │
│  │                                                               │     │
│  │  • Simulates service failures                                │     │
│  │  • Provides /health endpoint                                  │     │
│  │  • Configurable failure modes                                 │     │
│  └──────────────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
┌─────────────┐
│   Engineer  │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. Views Dashboard
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                          │
│                                                                 │
│  • Displays incidents, stats, services                         │
│  • Provides UI for status updates                              │
│  • Triggers AI analysis requests                               │
└──────┬──────────────────────────────────────────────────────────┘
       │
       │ 2. HTTP Requests (REST + MCP JSON-RPC)
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST API Endpoints                                       │  │
│  │  • GET    /api/incidents          → Read incidents        │  │
│  │  • PATCH  /api/incidents/:id/status → Update status       │  │
│  │  • POST   /api/incidents/:id/approve-action → Approve     │  │
│  │  • GET    /api/services           → Read services         │  │
│  │  • POST   /api/services            → Create service      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MCP JSON-RPC Endpoint                                    │  │
│  │  POST /api/mcp/jsonrpc                                    │  │
│  │                                                           │  │
│  │  Methods:                                                 │  │
│  │  • server/info  → Server metadata                        │  │
│  │  • tools/list   → List available tools                   │  │
│  │  • tools/call   → Execute tool (read-only)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MCP Tools (Read-Only)                                    │  │
│  │  • getIncidentById(id)      → Fetch incident              │  │
│  │  • getLogsByIncident(id)    → Fetch logs                  │  │
│  │  • analyzeIncident(id)      → Run AI analysis             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AI Analysis Service                                       │  │
│  │  • Reads incident + logs (read-only)                      │  │
│  │  • Calls NVIDIA NIM API                                    │  │
│  │  • Returns analysis (no DB writes)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Monitoring Service (Background)                         │  │
│  │  • Runs every 5 minutes                                   │  │
│  │  • Checks service health                                  │  │
│  │  • Creates incidents automatically                        │  │
│  │  • Auto-resolves if service recovers                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────┬──────────────────────────────────────────────────────────┘
       │
       │ 3. Database Operations
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                              │
│                                                                  │
│  Collections:                                                    │
│  • incidents  → Incident records                                │
│  • logs       → Log entries (linked to incidents)               │
│  • services   → Monitored service configurations                 │
└──────────────────────────────────────────────────────────────────┘
       │
       │ 4. External API Calls
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  NVIDIA NIM API                                          │   │
│  │  • Llama 3.1 8B Instruct (Primary)                       │   │
│  │  • Mistral 7B Instruct (Secondary)                      │   │
│  │  • AI analysis for incidents                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Demo Services (Acme Corp, etc.)                        │   │
│  │  • Health check endpoints                                │   │
│  │  • Simulated failures                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow: Incident Analysis Request

```
Engineer clicks "Run AI Analysis"
         │
         ▼
┌────────────────────┐
│  Frontend          │
│  (React Component) │
└─────────┬──────────┘
          │
          │ 1. aiApi.analyzeIncident(incidentId)
          │
          ▼
┌─────────────────────────────────────────┐
│  Frontend API Client                      │
│  POST /api/mcp/jsonrpc                    │
│  {                                        │
│    "method": "tools/call",                │
│    "params": {                            │
│      "name": "analyzeIncident",           │
│      "arguments": { incidentId: "..." }   │
│    }                                      │
│  }                                        │
└─────────┬─────────────────────────────────┘
          │
          │ 2. HTTP Request
          │
          ▼
┌─────────────────────────────────────────┐
│  Backend MCP Route Handler               │
│  (mcp.routes.js)                         │
│                                          │
│  • Validates JSON-RPC request           │
│  • Finds tool: "analyzeIncident"         │
│  • Validates arguments                   │
│  • Calls tool.implementation()           │
└─────────┬─────────────────────────────────┘
          │
          │ 3. Tool Execution
          │
          ▼
┌─────────────────────────────────────────┐
│  AI Analysis Service                     │
│  (aiAnalysis.service.js)                 │
│                                          │
│  analyzeIncidentReadOnly(incidentId)      │
│    │                                      │
│    ├─► Incident.findById(id)            │
│    │   (READ from MongoDB)               │
│    │                                      │
│    ├─► Log.find({ incidentId })         │
│    │   (READ from MongoDB)               │
│    │                                      │
│    ├─► analyzeSeverity(text)             │
│    │   └─► NVIDIA NIM API call           │
│    │                                      │
│    ├─► analyzeCategory(text)             │
│    │   └─► NVIDIA NIM API call           │
│    │                                      │
│    ├─► analyzeRootCause(incident, logs)   │
│    │   └─► NVIDIA NIM API call           │
│    │                                      │
│    └─► Return analysis object            │
│        (NO database writes)               │
└─────────┬─────────────────────────────────┘
          │
          │ 4. Analysis Result
          │
          ▼
┌─────────────────────────────────────────┐
│  MCP Response Format                     │
│  {                                      │
│    "jsonrpc": "2.0",                    │
│    "result": {                         │
│      "content": [{                     │
│        "type": "json",                 │
│        "data": {                        │
│          "incident": {...},            │
│          "aiAnalysis": {               │
│            "rootCause": "...",         │
│            "suggestedActions": [...]   │
│          },                            │
│          "explanation": "..."           │
│        }                                │
│      }]                                 │
│    }                                    │
│  }                                      │
└─────────┬─────────────────────────────────┘
          │
          │ 5. HTTP Response
          │
          ▼
┌─────────────────────────────────────────┐
│  Frontend                                │
│                                          │
│  • Parses MCP response                   │
│  • Extracts analysis data                │
│  • Updates UI state                      │
│  • Displays recommendations              │
│                                          │
│  Engineer sees:                          │
│  • Root cause explanation                │
│  • Confidence scores                     │
│  • Suggested actions                     │
│  • Related incidents                     │
└──────────────────────────────────────────┘
```

### MCP Architecture Detail

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP JSON-RPC Endpoint                      │
│                  POST /api/mcp/jsonrpc                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ JSON-RPC 2.0 Request
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ server/info  │  │  tools/list   │  │  tools/call   │
│              │  │               │  │               │
│ Returns:     │  │ Returns:      │  │ Executes:     │
│ • name       │  │ • Tool list   │  │ • Validates   │
│ • version    │  │ • Schemas     │  │ • Calls tool  │
│ • protocol   │  │ • Safety level│  │ • Returns data│
└───────────────┘  └───────┬───────┘  └───────┬───────┘
                           │                  │
                           │                  │ Tool Name
                           │                  │
        ┌──────────────────┼──────────────────┼──────────┐
        │                  │                  │          │
        ▼                  ▼                  ▼          ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Tool Registry│  │ getIncident  │  │ getLogs      │  │ analyze      │
│              │  │ ById        │  │ ByIncident   │  │ Incident     │
│ TOOL_        │  │             │  │             │  │              │
│ DEFINITIONS  │  │ • READ ONLY │  │ • READ ONLY │  │ • READ ONLY  │
│              │  │ • MongoDB   │  │ • MongoDB   │  │ • Calls AI   │
│ [            │  │   query     │  │   query     │  │ • No writes  │
│   {...},     │  │             │  │             │  │              │
│   {...},     │  └─────────────┘  └─────────────┘  └──────────────┘
│   {...}      │
│ ]            │
└──────────────┘
```

### Monitoring Service Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Monitoring Service (Background Process)          │
│              Runs every 5 minutes                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ 1. Fetch Services
                            │
                            ▼
                    ┌───────────────┐
                    │  MongoDB      │
                    │  Services     │
                    │  Collection   │
                    └───────┬───────┘
                            │
                            │ 2. For each enabled service
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  HTTP GET {service.url}/health        │
        │  Timeout: 5 seconds                   │
        └───────┬───────────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
   ┌────────┐      ┌──────────┐
   │ Healthy│      │ Unhealthy│
   │        │      │          │
   │ • Log  │      │ • Create │
   │   info │      │   incident│
   │        │      │ • Add log│
   │        │      │ • Link   │
   │        │      │   service│
   └────────┘      └─────┬────┘
                          │
                          │ 3. Check if incident exists
                          │
                          ▼
                  ┌───────────────┐
                  │  MongoDB      │
                  │  Incidents    │
                  │  Collection   │
                  └───────┬───────┘
                          │
                  ┌───────┴────────┐
                  │                │
                  ▼                ▼
            ┌──────────┐    ┌──────────────┐
            │ Existing │    │ New Incident │
            │ Incident │    │              │
            │          │    │ • Status:    │
            │ • Update │    │   "open"     │
            │   logs   │    │ • Timeline   │
            │ • Check  │    │ • Metadata   │
            │   status │    └──────────────┘
            └────┬─────┘
                 │
                 │ 4. Auto-resolution check
                 │    (if service recovers)
                 │
                 ▼
         ┌──────────────────┐
         │ Service Healthy  │
         │ for 30+ minutes? │
         └───────┬──────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌────────┐      ┌──────────┐
    │   Yes  │      │    No    │
    │        │      │          │
    │ • Set  │      │ • Keep   │
    │   status│      │   status │
    │   to    │      │   as is  │
    │   "auto-│      │          │
    │   resolved"│   │          │
    │ • Update│      │          │
    │   timeline│    │          │
    └─────────┘      └──────────┘
```

---

## 1. Project Purpose

### What Problem This System Solves

This system addresses the challenge of managing and analyzing system incidents in production environments. When services fail or degrade, engineers need to quickly understand what went wrong, why it happened, and what actions to take. Traditional incident management requires manual investigation, which is slow and error-prone.

### Who It Is Built For

The system serves two primary users:
- **Engineers**: Operations teams who need to monitor services, investigate incidents, and make resolution decisions
- **AI Agents**: Automated systems that can analyze incidents but must operate safely without making unauthorized changes

### Why AI Is Used

AI analysis provides three key benefits:
1. **Speed**: AI can analyze hundreds of log entries and incident data in seconds, identifying patterns humans might miss
2. **Consistency**: AI applies the same analytical framework to every incident, reducing human bias
3. **Scalability**: As the number of services and incidents grows, AI can handle analysis without proportional increase in human effort

However, AI is used strictly for **analysis and recommendations only**. All decisions and actions remain under human control.

---

## 2. High-Level Architecture

### System Components

The system consists of five main components that work together:

#### Frontend (Next.js React Application)
**Responsibilities:**
- Displays incidents, logs, and system statistics to engineers
- Provides UI for status updates and action approvals
- Triggers on-demand AI analysis requests
- Shows AI recommendations without executing them

**Location:** `incident-frontend/`

#### Backend (Express.js API Server)
**Responsibilities:**
- Stores incidents, logs, and services in MongoDB
- Provides REST APIs for frontend operations
- Hosts MCP JSON-RPC endpoint for AI tool access
- Coordinates between monitoring, AI analysis, and data storage
- Enforces business rules (e.g., only engineers can change status)

**Location:** `ai-incident-assistant/`

#### MCP Layer (Embedded in Backend)
**Responsibilities:**
- Exposes read-only tools via JSON-RPC 2.0 protocol
- Validates tool requests and parameters
- Routes tool calls to appropriate backend functions
- Ensures AI agents can only read data, never modify it

**Location:** `ai-incident-assistant/src/api/mcp.routes.js`

#### AI Provider (NVIDIA NIM)
**Responsibilities:**
- Provides Large Language Model inference (Llama 3.1 and Mistral)
- Analyzes incident text, logs, and context
- Returns severity classifications, category assignments, and root cause explanations
- Operates as external API service (not part of this codebase)

**Integration:** Called by backend via HTTP requests

#### Monitoring / Demo Systems
**Responsibilities:**
- Simulates production services that can fail
- Provides health check endpoints for monitoring
- Generates realistic failure scenarios for testing
- Demonstrates how the system detects and handles incidents

**Location:** `demo-company-server/`

### Data Flow

```
1. Monitoring Service (Backend)
   ↓
   Performs health checks on registered services
   ↓
2. Service Health Check Fails
   ↓
3. Backend Creates Incident
   ↓
   Stores in MongoDB
   ↓
4. Frontend Displays Incident
   ↓
   Engineer views incident details
   ↓
5. Engineer Requests AI Analysis (Optional)
   ↓
   Frontend calls MCP JSON-RPC endpoint
   ↓
6. MCP Tool Executes
   ↓
   Backend reads incident and logs from MongoDB
   ↓
7. Backend Calls NVIDIA NIM API
   ↓
   AI analyzes data and returns insights
   ↓
8. Backend Returns Analysis to Frontend
   ↓
   (No database writes - read-only)
   ↓
9. Frontend Displays AI Recommendations
   ↓
   Engineer reviews and makes decisions
   ↓
10. Engineer Updates Status (Manual)
    ↓
    Backend updates incident in MongoDB
```

---

## 3. Core Concepts Used

### Incident Management

An **incident** represents a detected problem with a monitored service. Each incident contains:
- **Metadata**: Title, description, severity, category, status
- **Timeline**: Chronological record of all events (detection, status changes, analysis)
- **Logs**: Associated log entries that provide context
- **Service Link**: Reference to which service the incident affects

Incidents progress through states: `open` → `investigating` → `resolved` (or `auto-resolved` by monitoring service). Engineers control status transitions manually.

### Monitoring and Alerting

The system continuously monitors registered services by:
- Performing health checks every 5 minutes
- Checking HTTP endpoints (typically `/health`)
- Evaluating response status and timing
- Creating incidents automatically when services are unhealthy

This is **proactive monitoring** - the system detects problems before users report them. The monitoring service runs as a background process in the backend.

### Model Context Protocol (MCP)

MCP is a protocol that allows AI agents to interact with systems through standardized tools. In this project:

- **MCP Tools** are functions that AI can call to read data
- **JSON-RPC 2.0** is the communication format
- **Read-Only Constraint** ensures AI cannot modify system state

MCP is embedded directly in the backend as a JSON-RPC endpoint (`/api/mcp/jsonrpc`), not as a separate server. This simplifies deployment while maintaining protocol compliance.

### Read-Only AI Analysis

AI analysis in this system **never writes to the database**. It:
- Reads incident data and logs
- Calls external AI APIs (NVIDIA NIM) for analysis
- Returns recommendations and insights
- Leaves all decision-making to engineers

This design prevents AI from making unauthorized changes, accidentally resolving incidents, or modifying critical data.

### Human-in-the-Loop Safety

Every action that changes system state requires explicit human approval:
- **Status Updates**: Engineers manually change incident status via UI
- **Action Execution**: AI-suggested actions are displayed but not executed automatically
- **Service Management**: Only engineers can register, update, or delete services

The system provides recommendations and insights, but humans make all decisions. This matches production incident management practices where safety and accountability are critical.

---

## 4. End-to-End System Flow

### Step 1: Incident Creation

The monitoring service runs continuously in the backend. Every 5 minutes, it:
1. Fetches all enabled services from the database
2. Makes HTTP GET requests to each service's health endpoint
3. Evaluates the response (status code, response time, health data)
4. If unhealthy, creates a new incident record in MongoDB
5. Generates initial log entries describing the failure

Incidents are created automatically - engineers do not manually create them. This ensures all incidents come from actual system detection.

### Step 2: Log and Metric Collection

As incidents progress, the system collects:
- **System Logs**: Automatically generated when status changes, actions are approved, or monitoring detects changes
- **Timeline Events**: Every significant action is recorded with timestamp, actor (system/engineer), and details
- **Metadata**: Log counts, error counts, first detection time, last update time

All data is stored in MongoDB and linked to the incident via `incidentId`.

### Step 3: MCP Tools Access Data

When an AI agent (or the frontend on behalf of an engineer) needs to analyze an incident:

1. **Request Format**: JSON-RPC 2.0 call to `/api/mcp/jsonrpc`
   ```json
   {
     "jsonrpc": "2.0",
     "method": "tools/call",
     "params": {
       "name": "analyzeIncident",
       "arguments": { "incidentId": "..." }
     }
   }
   ```

2. **Tool Execution**: Backend validates the request, finds the tool, and executes it
3. **Data Retrieval**: Tool reads incident and logs from MongoDB (read-only queries)
4. **Response**: Results wrapped in MCP JSON-RPC format and returned

Three tools are available:
- `getIncidentById`: Fetch a single incident
- `getLogsByIncident`: Fetch logs for an incident
- `analyzeIncident`: Run full AI analysis (uses the other two internally)

### Step 4: AI Analyzes Incidents

When `analyzeIncident` is called:

1. **Data Gathering**: Backend collects incident details and recent logs
2. **Text Preparation**: Formats data into prompts for AI analysis
3. **NVIDIA NIM Calls**: Makes HTTP requests to NVIDIA's API with:
   - Primary model: Llama 3.1 8B Instruct (best for reasoning)
   - Secondary model: Mistral 7B Instruct (backup)
   - Fallback: Rule-based pattern matching (if APIs fail)

4. **Analysis Tasks**:
   - **Severity Classification**: High, Medium, or Low
   - **Category Assignment**: Database, Network, Authentication, Deployment, or Performance
   - **Root Cause Analysis**: Identifies probable cause with confidence score

5. **Result Compilation**: Combines AI insights with:
   - Related incidents (same category, similar patterns)
   - Suggested actions (with confidence and approval requirements)
   - Trend analysis (is system degrading over time?)
   - Status recommendations (advisory only)

6. **Return**: Analysis object returned to caller (no database writes)

### Step 5: Results Reach Engineers

The frontend receives the analysis and displays:
- **Root Cause Explanation**: AI's understanding of what went wrong
- **Confidence Scores**: How certain the AI is about its analysis
- **Suggested Actions**: Specific remediation steps (e.g., "restart service", "check database")
- **Related Incidents**: Links to similar past incidents for context
- **Trend Indicators**: Whether the situation is improving or worsening

All displayed with clear indicators that these are **recommendations only**, not executed actions.

### Step 6: Manual Decisions

Engineers make all final decisions:

- **Status Updates**: Click buttons to change incident status (open → investigating → resolved)
- **Action Approval**: Review AI suggestions and explicitly approve if desired
- **Resolution**: Mark incidents as resolved when issues are fixed
- **Service Management**: Register new services, update configurations, enable/disable monitoring

The system tracks all decisions in the timeline for audit purposes.

---

## 5. MCP in This Project (Very Important)

### What MCP Means Here

In this project, MCP (Model Context Protocol) is implemented as a **JSON-RPC 2.0 endpoint embedded in the Express.js backend**. It is not a separate server or service - it's a route handler that follows MCP conventions.

**Why This Matters**: The system demonstrates how to integrate MCP into existing backend architectures without requiring separate infrastructure. This is practical for real-world deployments.

### What MCP Tools Are Exposed

Three read-only tools are available:

1. **`getIncidentById`**
   - **Purpose**: Fetch a single incident by MongoDB ID
   - **Input**: `{ id: string }`
   - **Output**: Incident document (read-only)
   - **Use Case**: AI needs incident details for analysis

2. **`getLogsByIncident`**
   - **Purpose**: Fetch all logs associated with an incident
   - **Input**: `{ incidentId: string }`
   - **Output**: Array of log documents (read-only)
   - **Use Case**: AI needs log context to understand what happened

3. **`analyzeIncident`**
   - **Purpose**: Run complete AI analysis on an incident
   - **Input**: `{ incidentId: string }`
   - **Output**: Complete analysis object with root cause, suggestions, trends
   - **Use Case**: Primary tool for AI-powered incident analysis
   - **Note**: This internally uses the other two tools

All tools are explicitly marked with `safetyLevel: "read-only"` in their metadata.

### What MCP Tools Are NOT Allowed to Do

MCP tools **cannot**:
- Create, update, or delete incidents
- Change incident status
- Modify logs or timeline events
- Execute actions (restart services, scale resources, etc.)
- Approve suggested actions
- Register or modify services

These operations are restricted to REST API endpoints that require explicit engineer interaction through the frontend.

### Why JSON-RPC Is Used

JSON-RPC 2.0 provides:
- **Standardization**: Well-defined protocol that AI frameworks understand
- **Simplicity**: Request/response format is easy to implement and debug
- **Error Handling**: Built-in error codes and messages
- **Compatibility**: Works with existing HTTP infrastructure

The backend implements JSON-RPC 2.0 methods:
- `server/info`: Returns server metadata
- `tools/list`: Lists available tools
- `tools/call`: Executes a specific tool

### Why MCP Is Embedded in Backend

Instead of running MCP as a separate server, it's embedded because:

1. **Simplicity**: One service to deploy and manage
2. **Security**: Direct database access without network hops
3. **Performance**: No inter-service latency
4. **Consistency**: Same authentication and authorization as REST APIs
5. **Practicality**: Easier to maintain and debug

This design choice reflects real-world constraints where adding new infrastructure is costly and complex.

---

## 6. Safety and Design Decisions

### Why AI Is Read-Only

AI analysis is read-only to prevent:
- **Unauthorized Changes**: AI cannot accidentally modify production data
- **Audit Trail Issues**: All changes must be traceable to human decisions
- **Safety Risks**: Automated actions could worsen situations if AI misinterprets context
- **Compliance**: Many industries require human oversight for critical operations

The system enforces this at multiple levels:
- MCP tools only expose read operations
- AI analysis service never calls database write methods
- Frontend separates analysis display from action execution

### Why Actions Require Approval

AI-suggested actions (like "restart service" or "scale resources") are displayed but not executed because:

1. **Context Matters**: AI may not have full system context (other incidents, maintenance windows, business priorities)
2. **Risk Assessment**: Engineers understand business impact better than AI
3. **Coordination**: Actions may need coordination with other teams
4. **Learning**: Engineers learn from reviewing AI suggestions, improving future decisions

The system provides a clear approval workflow:
- AI suggests action with confidence score
- Engineer reviews suggestion in UI
- Engineer explicitly clicks "Approve & Execute Action"
- System records approval in timeline
- **Note**: Actual execution is left to external automation (not implemented in this system)

### How the System Avoids Unsafe Automation

Multiple safeguards prevent unsafe automation:

1. **Tool Restrictions**: MCP tools are whitelisted - only read operations allowed
2. **Status Validation**: Backend validates status changes (only "open", "investigating", "resolved" allowed via API)
3. **Manual Triggers**: All state changes require explicit UI interactions
4. **Audit Logging**: Timeline records every action with actor identification
5. **No Auto-Execution**: Even approved actions are logged but not automatically executed

The only automated behavior is:
- **Incident Creation**: When monitoring detects failures (this is safe - it's detection, not action)
- **Auto-Resolution**: Monitoring service can mark incidents as "auto-resolved" if service recovers (this is a status change, not an action execution)

### How This Design Matches Real Production Systems

This design mirrors production incident management systems:

- **PagerDuty / Opsgenie**: Provide alerts and recommendations, but engineers make decisions
- **Datadog / New Relic**: AI suggests root causes, but humans investigate and resolve
- **ServiceNow**: Workflows require approvals before execution
- **GitHub Copilot / ChatGPT**: Provide code suggestions, but developers review and apply

The pattern is consistent: **AI augments human decision-making, it doesn't replace it**.

---

## 7. Current Limitations

### What the System Intentionally Does Not Do

The system is designed with intentional limitations for safety and clarity:

1. **No Automatic Action Execution**
   - AI can suggest actions, but nothing executes automatically
   - Even approved actions are logged but not executed
   - Actual execution would require separate automation infrastructure

2. **No AI Result Persistence**
   - AI analysis results are not saved to the database
   - Each analysis is on-demand and fresh
   - This ensures AI insights reflect current state, not stale data

3. **No Automatic Status Changes from AI**
   - AI provides status suggestions (e.g., "ready_for_resolution")
   - But these are advisory labels, not actual status values
   - Engineers must explicitly update status via UI

4. **No Multi-Incident Coordination**
   - AI analyzes one incident at a time
   - No cross-incident correlation or batch analysis
   - Each incident is treated independently

5. **No Predictive Analysis**
   - System reacts to current incidents
   - No forecasting of future failures
   - No proactive prevention suggestions

### What Is Left Manual on Purpose

These operations remain manual to ensure human oversight:

- **Service Registration**: Engineers must explicitly register services to monitor
- **Status Transitions**: All status changes require engineer action
- **Action Execution**: Even approved actions require separate automation (not in this system)
- **Service Configuration**: Health endpoints, categories, metadata are manually configured
- **Monitoring Control**: Engineers can start/stop monitoring service via API

### Why These Limits Exist

Limitations exist for three reasons:

1. **Safety**: Prevents AI from making decisions that could impact production
2. **Clarity**: Makes the system's behavior predictable and understandable
3. **Interview Focus**: Demonstrates understanding of safe AI integration without complexity

The system is a **proof of concept** showing how to integrate AI safely, not a complete production system.

---

## 8. Future Extensions (Conceptual Only)

These are **NOT implemented** but represent logical extensions:

### Monitoring MCP Tools

**Concept**: Expose monitoring service status and metrics via MCP tools
- `getMonitoringStatus`: Current monitoring state
- `getServiceHealth`: Real-time health of a service
- `getSystemMetrics`: Overall system statistics

**Why Not Implemented**: Would require exposing internal monitoring state, which adds complexity without demonstrating core MCP concepts.

### Action Executor MCP Server

**Concept**: Separate MCP server that can execute approved actions
- Receives action approvals from main backend
- Executes actions (restart services, scale resources, etc.)
- Reports execution results back

**Why Not Implemented**: Action execution requires infrastructure integration (Kubernetes, cloud APIs, etc.) which is beyond the scope of demonstrating safe AI integration.

### Approval Workflows

**Concept**: Multi-step approval process for high-risk actions
- Require multiple engineer approvals
- Time-based approvals (wait for maintenance window)
- Conditional approvals (only if certain conditions met)

**Why Not Implemented**: Adds workflow complexity that doesn't demonstrate core MCP or AI safety principles.

**Important**: These are **architectural concepts only**. The current system intentionally keeps scope limited to demonstrate safe AI integration patterns.

---

## 9. Interview Talking Points

### Key Points to Emphasize

1. **Read-Only AI Architecture**
   - AI analysis never writes to database
   - All tools are explicitly read-only
   - Results are advisory only, not executed

2. **MCP Integration Pattern**
   - MCP embedded in backend as JSON-RPC endpoint
   - Three read-only tools for incident analysis
   - Protocol compliance without separate infrastructure

3. **Human-in-the-Loop Safety**
   - Engineers make all decisions
   - AI provides recommendations with confidence scores
   - Actions require explicit approval

4. **Automatic Incident Detection**
   - Monitoring service detects failures proactively
   - Creates incidents automatically from health checks
   - No manual incident creation needed

5. **NVIDIA NIM Integration**
   - Primary/secondary model fallback strategy
   - Rule-based fallback if APIs unavailable
   - Graceful degradation ensures system always works

6. **Production-Ready Patterns**
   - Timeline tracking for audit trails
   - Status validation and business rule enforcement
   - Error handling and logging throughout

7. **Clear Separation of Concerns**
   - Frontend: Display and user interaction
   - Backend: Business logic and data management
   - MCP: AI tool access layer
   - AI: Analysis and recommendations only

### How to Explain the System

**Start with the problem**: "This system helps engineers manage incidents in production by using AI to analyze problems quickly, while keeping all decisions under human control."

**Explain the architecture**: "It's a three-tier system: React frontend for engineers, Express backend with MongoDB for data, and an embedded MCP layer that exposes read-only tools for AI analysis."

**Emphasize safety**: "The key design principle is that AI is read-only - it can analyze and recommend, but engineers make all decisions. This matches how production systems actually work."

**Highlight MCP**: "MCP is implemented as a JSON-RPC endpoint in the backend, not a separate server. This makes it practical to deploy while still following the protocol."

**Conclude with the value**: "The system demonstrates how to safely integrate AI into backend systems without risking unauthorized automation or unsafe decisions."

---

## Conclusion

This project demonstrates **safe AI integration in backend systems** by following three core principles:

1. **Read-Only AI**: AI analyzes and recommends, but never modifies system state
2. **Human Control**: All decisions and actions require explicit human approval
3. **Protocol Compliance**: MCP integration follows standards while remaining practical

The system is intentionally limited in scope to clearly demonstrate these patterns. It shows how AI can augment human decision-making in production environments without introducing risks from automated actions or unauthorized changes.

This approach matches real-world incident management systems where safety, auditability, and human oversight are non-negotiable requirements. The project serves as a practical example of how to integrate AI capabilities into backend systems while maintaining these critical constraints.

---

**Key Takeaway**: AI is a powerful tool for analysis and recommendations, but production systems require human oversight for safety and accountability. This project demonstrates how to achieve that balance.
