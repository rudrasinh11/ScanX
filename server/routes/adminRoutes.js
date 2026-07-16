import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createCaseStudyWithUpload, listCaseStudies } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import { loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAdmin);

const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
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
    const CaseStudy = (await import("../models/CaseStudy.js")).default;
    const deleted = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Case study not found." });
    return res.json({ message: "Case study deleted." });
  } catch (error) {
    return res.status(400).json({ message: "Could not delete case study." });
  }
});

export default router;
