require("dotenv/config");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const onboardingRoutes = require("./routes/onboarding.routes");
const roleRoutes = require("./routes/role.routes");
const employeeRoutes = require("./routes/employee.routes");
const reimbursementRoutes = require("./routes/reimbursement.routes");

const app = express();

// ── CORS ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "https://razorpay-assignment-ecru.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ── Body parsers ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check ───────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running 🚀",
  });
});

// ── API Routes ─────────────────────────────────────────────────────────
app.use("/rest/onboardings", onboardingRoutes);
app.use("/rest/roles", roleRoutes);
app.use("/rest/employees", employeeRoutes);
app.use("/rest/reimbursements", reimbursementRoutes);

// ── 404 handler ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Global error handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;