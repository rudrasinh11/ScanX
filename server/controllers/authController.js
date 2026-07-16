import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function loginAdmin(req, res) {
  const { password } = req.body || {};
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return res.status(500).json({ message: "Admin password not set on server." });
  if (!password || password !== expected) return res.status(401).json({ message: "Invalid password" });

  const secret = process.env.ADMIN_JWT_SECRET || expected;
  const token = jwt.sign({ role: "admin" }, secret, { expiresIn: process.env.ADMIN_JWT_EXPIRES || "8h" });
  return res.json({ token });
}
