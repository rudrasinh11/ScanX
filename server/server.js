import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server as IOServer } from "socket.io";
import path from "path";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Updated Dynamic CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173", 
  "https://scanx-market.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS policy block on this environment.'), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "100kb" }));

// SERVERLESS FIX: Intercept every single execution call to verify MongoDB is alive
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
});
app.use("/api/contact", contactLimiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "scanx-api" });
});

// Root fallback handler so checking the base backend URL doesn't return a 404
app.get("/", (req, res) => {
  res.send("ScanX API Server Active & Ready");
});

app.use("/api/contact", contactRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/admin", adminRoutes);

// Shared in-memory map context (Graceful fallback when running under serverless function routers)
const clients = new Map(); 

app.get("/api/admin/clients", (req, res) => {
  return res.json({ clients: Array.from(clients.values()) });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;

// Setup standard infrastructure engine configuration wrapper
const server = http.createServer(app);

// SERVERLESS SAFEGUARD: Only spin up active WebSockets if NOT running on Vercel
if (!process.env.VERCEL) {
  const io = new IOServer(server, {
    cors: { origin: allowedOrigins },
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
          const ContactSubmission = await import("./models/ContactSubmission.js").then(m => m.default).catch(()=>null);
          const id = payload._id || payload.id;
          if (ContactSubmission) {
            try {
              await ContactSubmission.findByIdAndUpdate(id, { socketId: socket.id, active: true }).exec();
            } catch (e) { console.error('Failed to persist socket mapping', e.message); }
          }
        }
        io.emit("clients", Array.from(clients.values()));
      } catch (e) {
        console.error("identify handler error:", e.message);
      }
    });

    socket.on("disconnect", () => {
      (async () => {
        try {
          const ContactSubmission = await import("./models/ContactSubmission.js").then(m => m.default).catch(()=>null);
          if (ContactSubmission) {
            await ContactSubmission.findOneAndUpdate({ socketId: socket.id }, { active: false, $unset: { socketId: 1 } }).exec();
          }
        } catch (e) { console.error('disconnect persist error', e.message); }
      })();
      clients.delete(socket.id);
      io.emit("clients", Array.from(clients.values()));
    });
  });
}

// Local Execution Pipeline Wrapper
if (!process.env.VERCEL) {
  connectDB().then(() => {
    server.listen(PORT, () => {
      console.log(`ScanX API running locally on http://localhost:${PORT}`);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
      } process.exit(1);
    });
  });
}

// Export module instance for Vercel Serverless Processor Engine
export default app;