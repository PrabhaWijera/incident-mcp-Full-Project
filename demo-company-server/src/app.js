const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const failureSimulator = require("./services/failureSimulator");
const healthController = require("./controllers/healthController");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const paymentController = require("./controllers/paymentController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";
    console.log(`[${logLevel}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    service: "Acme Corp API",
    version: "1.0.0",
    status: "running",
    description: "Demo company backend for incident management testing",
    endpoints: {
      health: "/health",
      api: "/api",
      auth: "/api/auth/login",
      users: "/api/users",
      payments: "/api/payments/process"
    }
  });
});

app.get("/health", healthController.checkHealth);
app.get("/api", (req, res) => {
  res.json({
    name: "Acme Corp API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      auth: {
        login: "POST /api/auth/login",
        verify: "GET /api/auth/verify"
      },
      users: {
        list: "GET /api/users",
        get: "GET /api/users/:id"
      },
      payments: {
        process: "POST /api/payments/process"
      },
      admin: {
        failureMode: "GET/POST /api/admin/failure-mode",
        reset: "POST /api/admin/reset"
      }
    },
    failureModes: {
      auth: "Authentication failures",
      database: "Database connection issues",
      cpu: "CPU overload / performance degradation",
      memory: "Memory leak simulation",
      network: "External dependency failures",
      config: "Configuration errors"
    }
  });
});

// API Routes
app.post("/api/auth/login", authController.login);
app.get("/api/auth/verify", authController.verify);
app.get("/api/users", userController.list);
app.get("/api/users/:id", userController.getById);
app.post("/api/payments/process", paymentController.process);

// Admin routes for failure simulation control
app.get("/api/admin/failure-mode", failureSimulator.getFailureMode);
app.post("/api/admin/failure-mode", failureSimulator.setFailureMode);
app.post("/api/admin/reset", failureSimulator.reset);

module.exports = app;

