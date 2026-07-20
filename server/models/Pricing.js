import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Basic Audit", "Premium Research"
  price: { type: Number, required: true }, // e.g., 20 or 499
  currency: { type: String, default: "INR" },
  billingPeriod: { type: String, default: "one-time" }, // "one-time", "monthly"
  description: { type: String, required: true },
  features: [{ type: String }], // Array of strings for features list
  isPopular: { type: Boolean, default: false },
  buttonText: { type: String, default: "Get Started" }
}, { timestamps: true });

export default mongoose.model("Pricing", pricingSchema);