import express from "express";
import { authCheck, authware, authwareLean } from "../middleware/authware.js";
import {
  registerUser,
  loginUser,
  registerCSH,
  onboarding,
  rolesCheck,
  checkCSH,
  requestHandle,
  getPendingCSH,
  approvedenyCSH,
  
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/onboarding", onboarding);

router.post("/csh/requestcheck", authwareLean, requestHandle)
router.post("/csh/check", authwareLean, checkCSH);
router.post("/csh/register",  registerCSH);
router.get("/csh/fetchpendingreq", authware, getPendingCSH);
router.post("/csh/approval", authware, approvedenyCSH)


router.post("/extracheck", rolesCheck);
router.post("/authcheck", authCheck)
export default router;
