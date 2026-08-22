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
  loginOauth,
  
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/oauthlogin", loginOauth)
router.post("/onboarding", onboarding);

router.post("/csh/requestcheck", authwareLean, requestHandle)
router.post("/csh/check", authwareLean, checkCSH);
router.post("/csh/register",  registerCSH);
router.post("/csh/approval", authware, approvedenyCSH)
router.get("/csh/fetchpendingreq", authware, getPendingCSH);



router.post("/extracheck", rolesCheck);
router.post("/authcheck", authCheck)
export default router;
