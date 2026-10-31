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
  getCSHHistory,
  checkClassCSH,
  ranking,
  settingSync,
  fetchSetting,
  trranking,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/oauthlogin", loginOauth);
router.post("/onboarding", authwareLean, onboarding);

router.post("/csh/requestcheck", authwareLean, requestHandle);
router.post("/csh/fetchuserreq", authwareLean, getCSHHistory);
router.post("/csh/check", authwareLean, checkCSH);
router.post("/csh/checkclass", authware, checkClassCSH);
router.post("/csh/register", authwareLean, registerCSH);
router.post("/csh/approval", authware, approvedenyCSH);
router.post("/csh/trrankings", authware, trranking);
router.get("/csh/fetchpendingreq", authware, getPendingCSH);
router.get("/csh/rankings", authwareLean, ranking);

router.post("/sync", authware, settingSync);
router.post("/classcheck", authware, fetchSetting);
router.post("/extracheck", authwareLean, rolesCheck);
router.post("/authcheck", authCheck);

export default router;
