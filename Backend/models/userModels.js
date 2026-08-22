import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: "",
  },
  grade: {
    type: String,
  },
  campus: {
    type: String,
  },
  googleId: {
    type: String,
    default:null,
  },
  schoolId: {
    type: String,
    unique: true,
    minLength: 7,
    maxLength: 7,
    sparse: true,
  },
});

const userModels = mongoose.models.user || mongoose.model("user", userSchema);

const extraSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },

  completeOnboard: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ["Student", "Teacher", "Admin"],
    default: "Student",
  },

  ApprovedRequest: {
    type: Number,
    default: 0,
  },

  PendingRequest: {
    type: Number,
    default: 0,
  },
});

const extrasModels = mongoose.models.extra || mongoose.model("extra", extraSchema);

const CSHhistory = new mongoose.Schema({
  activityName: {
    type: String,
    required: true,
  },

  requestHours: {
    type: Number,
    required: true,
  },

  dateofActivity: {
    type: Date,
    required: true,
  },

  vouch: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Denied"],
    default: "Pending",
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },

  description: {
    type: String,
    required:true,
  },

  trnote:{
    type: String,
  }
});

const CSHSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    ApprovedHours: {
      type: Number,
      default: 0,
    },

    PendingHours: {
      type: Number,
      default: 0,
    },

    history: [CSHhistory],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CSHSchema.virtual("TotalHours").get(function () {
  return (this.ApprovedHours || 0) + (this.PendingHours || 0);
});

const CSHModel = mongoose.models.CSH || mongoose.model("CSH", CSHSchema);

export { userModels, CSHModel, extrasModels };
