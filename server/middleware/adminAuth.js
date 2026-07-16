import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export default function adminAuth(req, res, next) {
  const bearer = req.get("Authorization");
  const token = bearer && bearer.startsWith("Bearer ") ? bearer.replace("Bearer ", "") : null;
  const pwHeader = req.headers["x-admin-password"];

  const jwtSecret = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD;
  if (!jwtSecret) return res.status(500).json({ message: "Admin auth not configured" });

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.admin = decoded;
      return next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid admin token" });
    }
  }

  // fallback to simple header password
  if (pwHeader && pwHeader === process.env.ADMIN_PASSWORD) return next();

  return res.status(401).json({ message: "Unauthorized - admin credentials required." });
}
