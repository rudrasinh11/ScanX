import express from "express";
import {
  createContactSubmission,
  getContactSubmissions,
  updateContactSubmission,
  approveContactSubmission,
} from "../controllers/contactController.js";
import adminAuth from "../middleware/adminAuth.js";
import mongoose from "mongoose";
import ContactSubmission from "../models/ContactSubmission.js";

const router = express.Router();

// ✅ This handles your frontend "Send Research Request" form submission!
router.post("/", createContactSubmission);

// Admin dashboard actions
router.get("/", adminAuth, getContactSubmissions);

router.patch("/:id", adminAuth, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid submission id." });
  try { return await updateContactSubmission(req, res, next); }
  catch (error) { console.error("Submission update failed:", error.message); return res.status(500).json({ message: "Could not update the submission." }); }
});

router.post("/:id/approve", adminAuth, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid submission id." });
  try { return await approveContactSubmission(req, res, next); }
  catch (error) { console.error("Approval email failed:", error.message); return res.status(500).json({ message: "Could not send the approval email. Check SMTP settings and try again." }); }
});

router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid submission id." });
    if (!["pending", "contacted", "converted"].includes(status)) return res.status(400).json({ message: "Invalid status." });
    
    const doc = await ContactSubmission.findByIdAndUpdate(id, { status }, { new: true }).exec();
    return res.json(doc);
  } catch (e) { console.error(e); return res.status(500).json({ message: e.message }); }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid submission id." });
    
    await ContactSubmission.findByIdAndDelete(id).exec();
    return res.json({ ok: true });
  } catch (e) { console.error(e); return res.status(500).json({ message: e.message }); }
});

export default router;