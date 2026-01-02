require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log("🏢 Acme Corp API Server running on port", PORT);
  console.log("📊 Health check: http://localhost:" + PORT + "/health");
  console.log("📝 API docs: http://localhost:" + PORT + "/api");
  console.log("\n⚠️  This server simulates realistic production failures");
  console.log("🔍 Monitor it with your incident management system\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

