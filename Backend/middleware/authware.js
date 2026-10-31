import jwt from "jsonwebtoken";
import { extrasModels } from "../models/userModels.js";

const decodedThispls = (req) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const authwareLean = (req, res, next) => {
  const decoded = decodedThispls(req);
  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token!" });
  }
  req.user = { id: decoded.id || decoded.userId, role: decoded.role };
  next();
};

const authware = async (req, res, next) => {
  try {
    const decoded = decodedThispls(req);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token!" });
    }
    const id = decoded.id || decoded.userId;
    const extra = await extrasModels.findOne({ userId: id });
    if (!extra || !["Admin", "Teacher"].includes(extra.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Denied access! Incorrect role!" });
    }
    req.user = { id, role: extra.role };
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const authCheck = (req, res) => {
  const decoded = decodedThispls(req);
  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token!" });
  }
  res.json({ success: true, message: "Access granted, verified." });
};

export { authware, authwareLean, authCheck };
