import vaildator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModels, CSHModel, extrasModels } from "../models/userModels.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const rolesCheck = async (req, res) => {
  try {
    const { userId } = req.body;
    const checkId = await extrasModels.findOne({ userId: userId });
    if (!checkId) {
      return res.status(400).json({ success: false, message: "" });
    }
    const fetchrole = checkId.role;
    if (fetchrole === "Admin") {
      const adtoken = jwt.sign(
        { userId, role: "Admin" }, 
        process.env.JWT_SECRET, )
      return res.json({
        success: true,
        message: "Adminstrative access.",
        adtoken,
      });
    } else if (fetchrole === "Teacher") {
      const trtoken = jwt.sign(
        { userId, role: "Admin" }, 
        process.env.JWT_SECRET, )
      return res.json({ success: true, message: "Teacher access.", trtoken });
    } else {
      return res.json({ success: false, message: "" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      const fetchname = user.name;
      const userId = user._id;
      res.json({
        success: true,
        message: "User logged in successfully",
        token,
        fetchname,
        userId,
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await userModels.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!vaildator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModels({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    const fetchname = user.name;
    const userId = user._id;
    res.json({
      success: true,
      message: "User registered successfully",
      token,
      fetchname,
      userId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const onboarding = async (req, res) => {
  try {
    const { userId, grade, campus, schoolId } = req.body;

    const Onboardcheck = await extrasModels.findOne({ userId: userId });

    if (Onboardcheck && Onboardcheck?.completeOnboard === true) {
      return res.json({
        success: false,
        message: "User has already completed.",
      });
    }

    if (
      !grade ||
      !campus ||
      (!schoolId && Onboardcheck?.completeOnboard === false)
    ) {
      return res.json({ success: false, message: "Missing infomation!" });
    }

    if (!schoolId || schoolId.length !== 7) {
      return res.json({ success: false, message: "School ID is incorrect" });
    }

    const exists = await userModels.findOne({
      _id: { $ne: userId },
      schoolId,
    });
    if (exists) {
      return res.json({
        success: false,
        message:
          "This infomation has already been taken! If you think there was a mistake, please contact an admin.",
      });
    }

    const updatedInfo = await userModels.findByIdAndUpdate(
      userId,
      {
        grade: grade,
        campus: campus,
        schoolId: schoolId,
      },
      { new: true },
    );
    if (!updatedInfo) {
      return res.json({
        success: false,
        message: "User not found! Something when wrong!",
      });
    }

    await extrasModels.findOneAndUpdate(
      { userId: userId },
      { completeOnboard: true },
      { new: true, upsert: true },
    );

    return res.json({
      success: true,
      message: "Successfully logged and onboarding completed!",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal server error" });
  }
};

const registerCSH = async (req, res) => {
  try {
    const { userId, activityName, requestHours, dateofActivity, vouch } =
      req.body;

    if (!activityName || !requestHours || !dateofActivity || !vouch) {
      return res.json({
        success: false,
        message: "Missing required infomation",
      });
    }

    const registering = await CSHModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          history: {
            activityName,
            requestHours: Number(requestHours),
            dateofActivity: new Date(dateofActivity),
            vouch,
            status: "Pending",
          },
        },
      },
      { new: true, upsert: true },
    );
    res.json({ success: true, message: "CSH logged successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { loginUser, registerUser, registerCSH, onboarding, rolesCheck };
