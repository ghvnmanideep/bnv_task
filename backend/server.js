require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const userRoutes = require("./routes/userRoutes");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Configuration - Robust for both local and production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bnv-task-1-cj2g.onrender.com",
  "https://bnv-task-ceso.onrender.com"
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(null, true); // Permissive for debugging
    }
  },
  credentials: true
}));

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes & Static Files
app.use("/api", userRoutes);
app.use("/uploads", express.static(uploadsDir));

// Production SPA Support
if (process.env.NODE_ENV === "production" || process.env.RENDER) {
  const distPath = path.join(__dirname, "../frontend/dist");
  console.log(`Serving Production Assets from: ${distPath}`);
  app.use(express.static(distPath));

  // Express 5 compatible catch-all using Regex
  // This avoids the 'PathError' by avoiding problematic string patterns
  app.get(/^((?!\/(api|uploads)).)*$/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// MongoDB Connection
console.log("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
