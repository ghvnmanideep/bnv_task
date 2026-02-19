const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- Configuration & Middleware ---
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://bnv-task-1-cj2g.onrender.com",
  "https://bnv-task-ceso.onrender.com"
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
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
app.use("/uploads", express.static(uploadsDir));
app.use("/api", userRoutes);

// --- Production SPA Support ---
if (process.env.NODE_ENV === "production" || process.env.RENDER) {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  // Catch-all route for SPA - using a more robust pattern for Express 5
  app.get("*", (req, res, next) => {
    if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// MongoDB Connection
console.log("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
