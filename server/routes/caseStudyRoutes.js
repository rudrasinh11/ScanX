import express from "express";
import {
  getCaseStudies,
  getCaseStudyBySlug,
  createCaseStudy,
} from "../controllers/caseStudyController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getCaseStudies);
router.get("/:slug", getCaseStudyBySlug);
router.post("/", adminAuth, createCaseStudy);

export default router;
