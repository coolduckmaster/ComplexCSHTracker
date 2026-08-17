import jwt from "jsonwebtoken";
import { userModels, extrasModels } from "../models/userModels.js";

const authware = async (req, res, next) => {
  try {
    const authorHead = req.headers.authorization;
    if (!authorHead) {
      return res.json({
        success: false,
        message: "Denied access! No token given!",
      });
    }

    const token = authorHead.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!token || token === "undefined" || token === "null") {
      return res.json({
        success: false,
        message: "Denied access! Invalid token format!",
      });
    }

    if (!["Admin", "Teacher"].includes(decoded.role)) {
      return res.json({
        success: true,
        message: "Denied access! Incorrect role!",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Invaild or expired token!" });
  }
};

const authwareLean = async (req, res, next) => {
  try {
    const authorhead = req.headers.authorization;
    if (!authorhead) {
      return res.json({
        success: false,
        message: "Denied access! No token given!",
      });
    }

    const token = authorhead.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!token || token === "undefined" || token === "null") {
      return res.json({
        success: false,
        message: "Denied access! Invaild token format!",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Invaild or expired token!" });
  }
};

const authCheck = async (req, res) => {
  try {
    const authorhead = req.headers.authorization;
    if (!authorhead) {
      return res.status(401).json({
        success: false,
        message: "Denied access! No token!",
      });
    }

    const token = authorhead.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!token || token === "undefined" || token === "null") {
      return res.json({
        success: false,
        message: "Denied access! Invaild token format!",
      });
    }

    req.user = decoded;
    res.json({ success: true, message: "Access granted, verified." });
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Invaild or expired token!" });
  }
};

export { authware, authwareLean, authCheck };
