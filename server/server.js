import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server as IOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ContactSubmission from "./models/ContactSubmission.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ES module environment setups for directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Whitelisted client ecosystems
const allowedOrigins = [
  "https://scanx-market.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

// 1. Permissive CORS Middleware Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy block on this environment."), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
  })
);

// Global Options handler for network preflight handshakes
app.options("*", cors());

app.use(express.json({ limit: "100kb" }));

// 2. Route static assets out of path intercepts cleanly
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', 'https://scanx-market.vercel.app');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Content-Type', 'application/pdf');
  }
}));

// Intercept every single execution call to verify MongoDB connection state
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database initialization failed inside middleware:", err.message);
    return res.status(500).json({ message: "Database connection failed." });
  }
});

// Basic protection against form-spam on the public contact endpoint
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "scanx-api" });
});

app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/admin", adminRoutes);

// Shared in-memory map context
const clients = new Map(); 

app.get("/api/admin/clients", (req, res) => {
  return res.json({ clients: Array.from(clients.values()) });
});

app.get("/", (req, res) => {
  res.send("ScanX API Server Active & Ready");
});

// ✅ FIXED: Initialize IOServer out of process.env.VERCEL blocker check, optimized for serverless architecture
const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling", "websocket"],
  allowEIO3: true
});

io.on("connection", (socket) => {
  clients.set(socket.id, { connectedAt: new Date().toISOString(), submission: null });
  io.emit("clients", Array.from(clients.values()));

  socket.on("identify", async (payload) => {
    try {
      const current = clients.get(socket.id) || { connectedAt: new Date().toISOString(), submission: null };
      current.submission = payload;
      clients.set(socket.id, current);

      if (payload && (payload._id || payload.id)) {
        const id = payload._id || payload.id;
        try {
          await ContactSubmission.findByIdAndUpdate(id, { socketId: socket.id, active: true }).exec();
        } catch (e) { console.error('Failed to persist socket mapping', e.message); }
      }
      io.emit("clients", Array.from(clients.values()));
    } catch (e) {
      console.error("identify handler error:", e.message);
    }
  });

  socket.on("disconnect", () => {
    (async () => {
      try {
        await ContactSubmission.findOneAndUpdate({ socketId: socket.id }, { active: false, $unset: { socketId: 1 } }).exec();
      } catch (e) { console.error('disconnect persist error', e.message); }
    })();
    clients.delete(socket.id);
    io.emit("clients", Array.from(clients.values()));
  });
});

// App routing fallback rules
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    server.listen(PORT, () => {
      console.log(`ScanX API running locally on http://localhost:${PORT}`);
    });
  });
}

export default app;