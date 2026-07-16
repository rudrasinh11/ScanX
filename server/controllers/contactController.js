import ContactSubmission from "../models/ContactSubmission.js";
import dotenv from "dotenv";
// Import all 4 required service functions cleanly
import { 
  sendAdminNewRequestEmail, 
  sendClientThankYouEmail, 
  sendClientApprovalEmail, 
  sendClientOnboardingEmail 
} from "../services/mailService.js";

dotenv.config();

// -------------------------------------------------------------------------
// 1. POST /api/contact (Client submits form -> Auto-sends Thank You & Admin Alert)
// -------------------------------------------------------------------------
export async function createContactSubmission(req, res) {
  try {
    const {
      name,
      businessName,
      website,
      instagram,
      industry,
      geography,
      decision,
      timeline,
      biggestChallenge,
      goals,
      email,
      phone,
    } = req.body;

    if (!name || !businessName || !industry || !biggestChallenge || !email) {
      return res.status(400).json({
        message: "Name, business name, industry, biggest challenge, and email are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentRequest = await ContactSubmission.findOne({ email: normalizedEmail, createdAt: { $gte: lastDay } });
    if (recentRequest) {
      return res.status(429).json({ message: "A request from this email was already received. Please wait 24 hours before sending another request." });
    }

    const submission = await ContactSubmission.create({
      name,
      businessName,
      website,
      instagram,
      industry,
      geography,
      decision,
      timeline,
      biggestChallenge,
      goals,
      email: normalizedEmail,
      phone,
      status: "pending"
    });

    // Fire automatic non-blocking emails
    sendAdminNewRequestEmail(submission).catch((mailErr) => {
      console.error("Failed to send admin notification email:", mailErr.message);
    });

    sendClientThankYouEmail(submission).catch((mailErr) => {
      console.error("Client automatic thank-you mail err:", mailErr.message);
    });

    return res.status(201).json({
      message: "Request received. We will review it and email you after approval.",
      id: submission._id,
      submission,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

// -------------------------------------------------------------------------
// 2. GET /api/contact (Admin Dashboard data fetching)
// -------------------------------------------------------------------------
export async function getContactSubmissions(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const q = req.query.q ? String(req.query.q).trim() : null;
    const status = ["pending", "contacted", "converted"].includes(req.query.status) ? req.query.status : null;
    const industry = req.query.industry ? String(req.query.industry).trim() : null;
    const allowedSorts = ["name", "businessName", "email", "industry", "status", "createdAt"];
    const sortBy = allowedSorts.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { businessName: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { industry: { $regex: q, $options: "i" } },
          ],
        }
      : {};
    if (status) filter.status = status;
    if (industry) filter.industry = industry;

    const total = await ContactSubmission.countDocuments(filter);
    const items = await ContactSubmission.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({ total, items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch submissions." });
  }
}

// -------------------------------------------------------------------------
// 3. PATCH /api/contact/:id (Admin edits details manually)
// -------------------------------------------------------------------------
export async function updateContactSubmission(req, res) {
  const allowedFields = ["name", "businessName", "website", "instagram", "industry", "geography", "decision", "timeline", "biggestChallenge", "goals", "email", "phone"];
  const update = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowedFields.includes(key)));
  if (update.email) {
    update.email = String(update.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(update.email)) return res.status(400).json({ message: "Enter a valid email address." });
  }
  const submission = await ContactSubmission.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!submission) return res.status(404).json({ message: "Submission not found." });
  return res.json(submission);
}

// -------------------------------------------------------------------------
// 4. POST /api/contact/:id/approve (Admin clicks send button -> Infinite Multi-Stage Emails)
// -------------------------------------------------------------------------
export async function approveContactSubmission(req, res) {
  try {
    const submission = await ContactSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found." });

    if (submission.status === "pending") {
      // Send Stage 2 Email: Official Approval Notification
      await sendClientApprovalEmail(submission);
      submission.status = "contacted"; 
    } else if (submission.status === "contacted" || submission.status === "converted") {
      // Send Stage 3 Email: Converted Partner Onboarding Welcome
      await sendClientOnboardingEmail(submission);
    }

    submission.approvalEmailSentAt = new Date();
    await submission.save();
    
    return res.json({ message: `Email cycle processed successfully for status: ${submission.status}`, submission });
  } catch (error) {
    console.error("Action handler error:", error.message);
    return res.status(500).json({ message: "Could not process email operation." });
  }
}