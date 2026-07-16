import CaseStudy from "../models/CaseStudy.js";

// GET /api/case-studies?industry=Retail
export async function getCaseStudies(req, res) {
  try {
    const { industry } = req.query;
    const filter = industry && industry !== "All" ? { industry } : {};
    const caseStudies = await CaseStudy.find(filter).sort({ createdAt: -1 });
    return res.json(caseStudies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch case studies." });
  }
}

// GET /api/case-studies/:slug
export async function getCaseStudyBySlug(req, res) {
  try {
    const caseStudy = await CaseStudy.findOne({ slug: req.params.slug });
    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found." });
    }
    return res.json(caseStudy);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch case study." });
  }
}

// POST /api/case-studies  (admin/seed use)
export async function createCaseStudy(req, res) {
  try {
    const caseStudy = await CaseStudy.create(req.body);
    return res.status(201).json(caseStudy);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}
