import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    instagram: { type: String, trim: true },
    industry: { type: String, required: true, trim: true },
    geography: { type: String, trim: true },
    decision: { type: String, trim: true },
    timeline: { type: String, trim: true },
    biggestChallenge: { type: String, required: true, trim: true },
    goals: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "contacted", "converted"],
      default: "pending",
    },
    approvalEmailSentAt: { type: Date },
    socketId: { type: String },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ContactSubmission", contactSubmissionSchema);
