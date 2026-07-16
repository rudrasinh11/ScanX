import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import CaseStudy from "../models/CaseStudy.js";

dotenv.config();

const caseStudies = [
  {
    slug: "coastal-cafe-group",
    industry: "Hospitality",
    businessName: "Coastal Café Group",
    objective: "Improve repeat visit rate and local search visibility.",
    tags: ["Reviews", "Local SEO", "Customer Journey"],
    researchAreas: ["Google Reviews", "Google Maps", "Instagram", "Competitor Websites"],
    summary:
      "A three-location café group with strong first-time footfall but weak repeat visits. Research traced this to inconsistent loyalty messaging and a thin Google Business presence relative to two nearby competitors.",
    swot: {
      strengths: ["Strong first impression", "High foot-traffic locations"],
      weaknesses: ["No repeat-visit incentive", "Thin Google Business profile"],
      opportunities: ["Loyalty program", "Local SEO content"],
      threats: ["Two competitors gaining review volume monthly"],
    },
    customerJourney:
      "First visits are consistently positive, but nothing in-store or online prompts a second visit within two weeks, the window where habit typically forms.",
    websiteAudit:
      "Menu page loads slowly on mobile and lacks structured data, limiting rich results in local search.",
    competitorAnalysis:
      "Two nearby cafés publish weekly Google posts and respond to all reviews within 24 hours; Coastal does neither.",
    growthOpportunities: [
      "Launch a simple stamp-card loyalty program",
      "Respond to all reviews within 48 hours",
      "Publish weekly Google Business updates",
    ],
    roadmap: [
      { phase: "0–30 days", detail: "Claim and optimize Google Business profiles for all locations" },
      { phase: "30–60 days", detail: "Launch loyalty card and staff training" },
      { phase: "60–90 days", detail: "Publish local SEO content and measure repeat-visit lift" },
    ],
    featured: true,
  },
  {
    slug: "wellview-dental-clinic",
    industry: "Healthcare",
    businessName: "Wellview Dental Clinic",
    objective: "Strengthen digital trust signals ahead of a second location.",
    tags: ["Brand", "Reviews", "Web Audit"],
    researchAreas: ["Google Reviews", "Official Website", "PageSpeed", "Industry Reports"],
    summary:
      "An established single-location clinic preparing to open a second site. Research found strong in-person trust that isn't yet reflected online, a common risk before geographic expansion.",
    swot: {
      strengths: ["12+ years local reputation", "Referral-heavy patient base"],
      weaknesses: ["Outdated website", "Few recent reviews"],
      opportunities: ["Refreshed digital presence ahead of launch", "Review generation system"],
      threats: ["New-location competitors with stronger digital presence"],
    },
    customerJourney:
      "Most new patients still arrive via word of mouth; the website is rarely the deciding factor, which will not hold in a second, unfamiliar market.",
    websiteAudit:
      "Site is not mobile-optimized and has no online booking, a growing expectation among patients researching providers.",
    competitorAnalysis:
      "Clinics in the target expansion area average 4.6 stars with 200+ reviews and offer online booking.",
    growthOpportunities: [
      "Rebuild website with mobile-first booking",
      "Systematic review request at checkout",
      "Local content for the new service area",
    ],
    roadmap: [
      { phase: "0–30 days", detail: "Website audit findings implemented" },
      { phase: "30–60 days", detail: "Review generation system live" },
      { phase: "60–90 days", detail: "Second-location local SEO foundation" },
    ],
    featured: true,
  },
  {
    slug: "northline-home-goods",
    industry: "Retail",
    businessName: "Northline Home Goods",
    objective: "Identify why in-store traffic isn't converting to online sales.",
    tags: ["Competitor", "Journey", "Growth"],
    researchAreas: ["Official Website", "Competitor Websites", "Instagram", "PageSpeed"],
    summary:
      "A home goods retailer with healthy in-store sales but a website that converts far below category benchmarks. Research pointed to checkout friction and a disconnected social presence.",
    swot: {
      strengths: ["Loyal in-store customer base", "Distinct product curation"],
      weaknesses: ["High checkout abandonment", "Social presence disconnected from store"],
      opportunities: ["Simplified checkout", "Shoppable Instagram integration"],
      threats: ["Category-wide shift to online-first shopping"],
    },
    customerJourney:
      "Customers discover products in-store and on Instagram, but the path from Instagram post to purchase involves too many steps and drops off before checkout.",
    websiteAudit:
      "Checkout requires account creation before purchase, a common cause of cart abandonment.",
    competitorAnalysis:
      "Two direct competitors offer guest checkout and shoppable social posts; Northline offers neither.",
    growthOpportunities: [
      "Enable guest checkout",
      "Connect Instagram catalog to store inventory",
      "Simplify the mobile purchase path",
    ],
    roadmap: [
      { phase: "0–30 days", detail: "Guest checkout implemented" },
      { phase: "30–60 days", detail: "Shoppable Instagram launched" },
      { phase: "60–90 days", detail: "Conversion rate re-measured against baseline" },
    ],
    featured: true,
  },
];

async function run() {
  await connectDB();
  await CaseStudy.deleteMany({});
  await CaseStudy.insertMany(caseStudies);
  console.log(`Seeded ${caseStudies.length} case studies.`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
