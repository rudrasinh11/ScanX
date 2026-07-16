import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    industry: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    objective: { type: String, required: true },
    tags: [{ type: String }],
    researchAreas: [{ type: String }],
    summary: { type: String },
    swot: {
      strengths: [String],
      weaknesses: [String],
      opportunities: [String],
      threats: [String],
    },
    customerJourney: { type: String },
    websiteAudit: { type: String },
    competitorAnalysis: { type: String },
    growthOpportunities: [String],
    roadmap: [
      {
        phase: String,
        detail: String,
      },
    ],
    pdfUrl: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CaseStudy", caseStudySchema);
