import Pricing from "../models/Pricing.js";

// Public: Get all plans
export async function getPricingPlans(req, res) {
  try {
    const plans = await Pricing.find().sort({ price: 1 });
    return res.json(plans);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching pricing plans" });
  }
}

// Admin: Add new pricing plan
export async function createPricingPlan(req, res) {
  try {
    const newPlan = await Pricing.create(req.body);
    return res.status(201).json(newPlan);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// Admin: Update pricing plan
export async function updatePricingPlan(req, res) {
  try {
    const updatedPlan = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updatedPlan);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// Admin: Delete pricing plan
export async function deletePricingPlan(req, res) {
  try {
    await Pricing.findByIdAndDelete(req.params.id);
    return res.json({ message: "Pricing plan deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting plan" });
  }
}