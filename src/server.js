require("dotenv/config");
const app = require("./app");
const { connectDB, disconnectDB } = require("./config/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to database first
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  // ── Graceful shutdown ────────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      console.log("✅ Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    shutdown("unhandledRejection");
  });
};

startServer();
