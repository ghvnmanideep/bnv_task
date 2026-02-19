require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Static Files (Uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes (Must be above static site handler)
app.use("/api", userRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === "production" || process.env.RENDER) {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  app.get("/*", (req, res) => {
    // Only handle if it's not an api route (redundant insurance)
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(distPath, "index.html"));
    }
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
