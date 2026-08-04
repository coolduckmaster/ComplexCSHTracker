import express from "express";
import {
  registerUser,
  loginUser,
  registerCSH,
  onboarding,
  rolesCheck,
  checkCSH,
  RequestHandle,
  
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/onboarding", onboarding);

router.post("/csh/requestcheck", RequestHandle)
router.post("/csh/check", checkCSH);
router.post("/csh/register", registerCSH);


router.post("/extracheck", rolesCheck);
export default router;
