import CaseStudy from "../models/CaseStudy.js";
import path from "path";

export async function createCaseStudyWithUpload(req, res) {
  try {
    const body = req.body || {};
    const pdfFile = req.file;
    if (pdfFile) {
      // save public URL
      body.pdfUrl = `/uploads/${pdfFile.filename}`;
    }
    // minimal required fields: slug, industry, businessName, objective
    const doc = await CaseStudy.create({
      slug: body.slug,
      industry: body.industry,
      businessName: body.businessName,
      objective: body.objective,
      tags: body.tags ? (Array.isArray(body.tags) ? body.tags : body.tags.split(",").map(s=>s.trim())) : [],
      summary: body.summary || "",
      pdfUrl: body.pdfUrl || "",
    });
    return res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}

export async function listCaseStudies(req, res) {
  try {
    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
    return res.json(caseStudies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch case studies." });
  }
}
