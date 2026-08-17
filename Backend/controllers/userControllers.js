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
    if (!userId) {
      return res.json({ success: false, message: "User ID is required." });
    }

    const checkId = await extrasModels.findOne({ userId: userId });

    if (!checkId) {
      return res.status(400).json({ success: false, message: "" });
    }

    const fetchrole = checkId.role;

    if (fetchrole === "Admin") {
      const adtoken = jwt.sign(
        { userId, role: fetchrole },
        process.env.JWT_SECRET,
      );
      return res.json({
        success: true,
        message: "Adminstrative access.",
        adtoken,
      });
    } else if (fetchrole === "Teacher") {
      const trtoken = jwt.sign(
        { userId, role: fetchrole },
        process.env.JWT_SECRET,
      );
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

const getPendingCSH = async (req, res) => {
  try {
    const getPendingReq = await CSHModel.aggregate([
      { $unwind: "$history" },
      { $match: { "history.status": "Pending" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { "history.submittedAt": 1 } },
      {
        $project: {
          _id: 0,
          requestId: "$history._id",
          userId: "$user._id",
          userName: "$user.name",
          grade: "$user.grade",
          campus: "$user.campus",
          schoolId: "$user.schoolId",
          activityName: "$history.activityName",
          requestHours: "$history.requestHours",
          dateofActivity: "$history.dateofActivity",
          vouch: "$history.vouch",
          submittedAt: "$history.submittedAt",
          description: "$history.description",
        },
      },
    ]);

    return res.json({
      success: true,
      count: getPendingReq.length,
      data: getPendingReq,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

const approvedenyCSH = async (req, res) => {
  try {
    const { userId, requestId, status, trnote } = req.body;

    if (!userId || !requestId) {
      return res.json({ success: false, message: "Missing infomation!" });
    }

    if (trnote !== undefined && !status) {
      try {
        const updateNote = await CSHModel.findOneAndUpdate(
          {
            userId,
            "history._id": requestId,
          },
          {
            $set: { "history.$.trnote": trnote },
          },
          { new: true },
        );

        return res.json({ success: true, message: "Added note!" });
      } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }
    }

    if (!status) {
      return res.json({ success: false, message: "No status data sent!" });
    }

    const User = await CSHModel.findOne({ userId });
    const History = User.history.find(
      (item) =>
        item._id.toString() === requestId || item.requestId === requestId,
    );

    if (!User || !History) {
      return res.json({ success: false, message: "Doesn't exist." });
    }

    const hours = Number(History.requestHours);
    const isApproved = status === "Approved";

    const updateCSH = await CSHModel.findOneAndUpdate(
      {
        userId,
        history: { $elemMatch: { _id: requestId, status: "Pending" } },
      },
      {
        $set: { "history.$.status": status },
        $inc: {
          PendingHours: -hours,
          ...(isApproved && { ApprovedHours: hours }),
        },
      },
      { new: true },
    );

    if (!updateCSH) {
      return res.json({
        sucess: false,
        message: "Request was already processed, status is no longer pending.",
      });
    }

    await extrasModels.findOneAndUpdate(
      { userId },
      {
        $inc: {
          PendingRequest: -1,
          ...(isApproved && { ApprovedRequest: 1 }),
        },
      },
      { upsert: true },
    );

    return res.json({
      success: true,
      message: `CSH Requests has been successfully ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal server error" });
  }
};

const registerCSH = async (req, res) => {
  const fullDate = new Date().toISOString().split("T")[0];

  try {
    const {
      userId,
      activityName,
      requestHours,
      dateofActivity,
      vouch,
      description,
    } = req.body;

    if (
      !activityName ||
      !requestHours ||
      !dateofActivity ||
      !vouch ||
      !description
    ) {
      return res.json({
        success: false,
        message: "Missing required infomation",
      });
    }

    if (dateofActivity > fullDate) {
      return res.json({
        success: false,
        message: "Error: Date of actvity invaild!",
      });
    }

    const numberoHours = Number(requestHours);

    const registering = await CSHModel.findOneAndUpdate(
      { userId: userId },
      {
        $inc: { PendingHours: requestHours },
        $push: {
          history: {
            activityName,
            requestHours: Number(requestHours),
            dateofActivity: new Date(dateofActivity),
            vouch,
            status: "Pending",
            description,
          },
        },
      },
      { new: true, upsert: true },
    );

    await extrasModels.findOneAndUpdate(
      { userId: userId },
      { $inc: { PendingRequest: 1 } },
      { upsert: true },
    );

    res.json({ success: true, message: "CSH logged successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const checkCSH = async (req, res) => {
  try {
    const { userId, ApprovedHours, PendingHours } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "No user ID",
      });
    }

    let cshData = await CSHModel.findOne({ userId: userId });

    if (!cshData) {
      cshData = await CSHModel.create({
        userId,
        ApprovedHours: 0,
        PendingHours: 0,
      });
    }

    return res.json({
      success: true,
      data: cshData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const requestHandle = async (req, res) => {
  try {
    const { userId, ApprovedRequest, PendingRequest } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "No user ID",
      });
    }

    let requestData = await extrasModels.findOne({ userId: userId });

    if (!requestData) {
      requestData = awaitextrasModels.create({
        ApprovedRequest: 0,
        PendingRequest: 0,
      });
    }

    return res.json({
      success: true,
      data: requestData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  loginUser,
  registerUser,
  registerCSH,
  onboarding,
  rolesCheck,
  checkCSH,
  requestHandle,
  getPendingCSH,
  approvedenyCSH,
};
