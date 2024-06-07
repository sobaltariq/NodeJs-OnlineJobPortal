const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobSeeker",
    required: true,
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPosting",
    required: true,
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Application", applicationSchema);
