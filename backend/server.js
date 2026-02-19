require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Configuration & Middleware ---
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://bnv-task-1-cj2g.onrender.com"
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Static Files & API Routes ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoutes);

// --- Production SPA Support ---
if (process.env.NODE_ENV === "production" || process.env.RENDER) {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  // Catch-all route for SPA - compatible with Express 5 path patterns
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
