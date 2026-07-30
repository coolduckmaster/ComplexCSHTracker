import express from "express";
import { registerUser, loginUser, registerCSH, onboarding} from "../controllers/userControllers.js";


const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/regCSH", registerCSH)
router.post("/onboarding", onboarding)


export default router