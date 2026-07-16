import express from "express";
import { 
  getCaseStudies, 
  getCaseStudyBySlug 
} from "../controllers/caseStudyController.js"; // Verify this matches the filename inside your controllers directory

const router = express.Router();

// Public routes used by your frontend client to render portfolio gallery data
router.get("/", getCaseStudies);
router.get("/:slug", getCaseStudyBySlug);

export default router;