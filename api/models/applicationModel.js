const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema(
  {
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    jobEmployer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer", // Assuming you have an Employer model
      required: true,
    },
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    chatStarted: {
      type: Boolean,
      default: false,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
