import express from "express";
import {
  registerUser,
  loginUser,
  registerCSH,
  onboarding,
  rolesCheck,
  checkCSH,
  
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/csh/register", registerCSH);
router.post("/csh/check", checkCSH);
router.post("/onboarding", onboarding);
router.post("/extracheck", rolesCheck);

export default router;
