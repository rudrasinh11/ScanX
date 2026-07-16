import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createCaseStudyWithUpload, listCaseStudies } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import { loginAdmin } from "../controllers/authController.js";
import CaseStudy from "../models/CaseStudy.js"; // FIXED: Static import instead of dynamic runtime `await import`

const router = express.Router();

router.post("/login", loginAdmin);

const uploadsDir = path.join(process.cwd(), "uploads");

// FIXED: Bypasses folder creation block cleanly when initialized inside Vercel's read-only platform
if (!process.env.VERCEL) {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // FIXED: Route storage objects into the operating system's temporary dynamic memory cache block if running under serverless deployment layers
    const targetDest = process.env.VERCEL ? "/tmp" : uploadsDir;
    cb(null, targetDest);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") return cb(new Error("Only PDF uploads are allowed."));
    cb(null, true);
  },
});

router.get("/case-studies", adminAuth, listCaseStudies);
router.post("/case-studies", adminAuth, upload.single("pdf"), createCaseStudyWithUpload);

router.delete("/case-studies/:id", adminAuth, async (req, res) => {
  try {
    // FIXED: Removed the dynamic 'await import' compile blocker
    const deleted = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Case study not found." });
    return res.json({ message: "Case study deleted." });
  } catch (error) {
    return res.status(400).json({ message: "Could not delete case study." });
  }
});

export default router;