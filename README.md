# AI-Powered Incident Management System

This comprehensive system provides automated detection, monitoring, and AI-powered analysis of software incidents across distributed services. The platform combines continuous monitoring with advanced artificial intelligence to help engineering teams quickly identify, diagnose, and resolve system failures.

## System Overview

The AI-Powered Incident Management System addresses critical challenges in modern software operations:

- **Automated Detection**: Continuously monitors services and automatically creates incidents when failures are detected
- **AI-Powered Analysis**: Leverages NVIDIA NIM AI models to identify root causes and suggest remediation actions
- **Centralized Management**: Provides a unified dashboard for managing all incidents across services
- **Real-Time Monitoring**: Offers live monitoring with automatic health checks every 5 minutes
- **Human-in-the-Loop**: Ensures all critical actions require human approval while providing AI assistance

## Problem Solving

This system solves several key challenges in incident management:

- **Manual Detection**: Eliminates the need for manual monitoring by automatically detecting service failures
- **Time-Consuming Diagnostics**: Uses AI to quickly identify root causes instead of lengthy manual investigation
- **Scattered Information**: Centralizes incident data from multiple services in one dashboard
- **Inconsistent Responses**: Provides standardized analysis and suggested actions for common failure patterns
- **Delayed Resolution**: Accelerates incident resolution through intelligent recommendations

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                 DEMO COMPANY SERVER                                       │
│                                                                                                           │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐              │
│  │   API Subsystem │     │ Database Subsys │     │ Auth Subsystem  │     │  Overall Health │              │
│  │      (Healthy)  │     │  (Can fail)     │     │   (Can fail)    │     │   (Degraded)    │              │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                              │
                              │ Health Check Requests (every 5 mins)
                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              BACKEND API SERVER                                          │
│                                                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                    MONITORING SERVICE (Continuous)                                                  │ │
│  │                                                                                                     │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │ │
│  │  │  Health Check   │ -> │ Failure Detect  │ -> │  Incident Create│ -> │  Auto-Remediation     │  │ │
│  │  │    Engine       │    │     Logic       │    │     Engine      │    │      Suggestions    │  │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                    AI ANALYSIS ENGINE (NVIDIA NIM)                                                  │ │
│  │                                                                                                     │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │ │
│  │  │  Severity       │ -> │  Category       │ -> │ Root Cause      │ -> │  Action Suggestions   │  │ │
│  │  │  Analysis       │    │  Classification │    │  Identification │    │        Engine         │  │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   MongoDB       │    │   REST API      │    │   MCP JSON-RPC  │    │  Express Server │              │
│  │   (Storage)     │    │   (Endpoints)   │    │   (AI Tools)    │    │   (HTTP)        │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                               FRONTEND DASHBOARD                                          │
│                                                                                                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   Dashboard     │    │  Incidents      │    │   Services      │    │   User Guide    │              │
│  │   View          │    │   Management    │    │   Management    │    │   Interface     │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘              │
│         │                       │                       │                       │                       │
│         │ Display               │ Display               │ Display               │ Display               │
│         ▼                       ▼                       ▼                       ▼                       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   Statistics    │    │  Incident Cards │    │  Service List   │    │  Instructions   │              │
│  │   & Metrics     │    │   & Details     │    │   & Controls    │    │  & Tutorials    │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Components

### Backend API Server (ai-incident-assistant)
- **Core Functionality**: Handles incident management, service registration, and continuous monitoring
- **API Layer**: Provides REST API and MCP JSON-RPC endpoints for AI tools
- **Data Storage**: Connects to MongoDB for persistent data storage
- **AI Integration**: Integrates with NVIDIA NIM for intelligent incident analysis
- **Monitoring**: Automatically polls registered services every 5 minutes
- **Incident Lifecycle**: Manages complete incident lifecycle from detection to resolution

### Frontend Dashboard (incident-frontend)
- **Technology Stack**: Built with Next.js 16.1.1, React 19, and TypeScript
- **Real-Time UI**: Provides real-time monitoring with auto-refresh capabilities
- **Visualization**: Displays incidents, services, and system statistics in an intuitive interface
- **AI Interaction**: Allows users to request AI-powered analysis and view recommendations
- **Management Interface**: Enables service registration and incident status management

### Demo Company Server (demo-company-server)
- **Simulation**: Simulated production service for testing incident management capabilities
- **Health Endpoints**: Provides multiple health check endpoints that simulate various failure scenarios
- **Failure Modeling**: Simulates realistic failure patterns with configurable probabilities
- **Integration**: Designed specifically to integrate with the monitoring system for demonstration

## DashBoard View
<img width="1920" height="2353" alt="image" src="https://github.com/user-attachments/assets/b4a91737-1b0f-4093-8f6f-2aec04dff5a2" />

## Incidents Page
<img width="1920" height="9432" alt="image" src="https://github.com/user-attachments/assets/e2d63451-e827-4279-ac07-fe5fbff534a3" />

## Services Page
<img width="1920" height="992" alt="image" src="https://github.com/user-attachments/assets/97f3709f-36f6-463e-b2d3-de01cfbb3026" />

## User Guide 
<img width="1920" height="9315" alt="image" src="https://github.com/user-attachments/assets/27a12da2-8086-4d2a-b4b9-b1fd1209dc32" />

