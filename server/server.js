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

// serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173", "https://scanx-market.vercel.app"]
  })
);
app.use(express.json({ limit: "100kb" }));

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

app.use("/api/contact", contactRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;

// set up http server + socket.io to track connected clients
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: [process.env.CLIENT_URL || "http://localhost:5173", "https://scanx-market.vercel.app"] },
});

// track connected clients with optional submission data
const clients = new Map(); // socketId -> { connectedAt, submission }

io.on("connection", (socket) => {
  clients.set(socket.id, { connectedAt: new Date().toISOString(), submission: null });
  // send updated clients list
  io.emit("clients", Array.from(clients.values()));

  socket.on("identify", async (payload) => {
    try {
      // payload could be { id } or full submission object
      const current = clients.get(socket.id) || { connectedAt: new Date().toISOString(), submission: null };
      current.submission = payload;
      clients.set(socket.id, current);

      // if payload contains a submission id, persist mapping
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
    // persist active=false for any submission with this socketId
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

app.get("/api/admin/clients", (req, res) => {
  return res.json({ clients: Array.from(clients.values()) });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`ScanX API running on http://localhost:${PORT}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the process using that port or change PORT in .env.`);
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });
});
