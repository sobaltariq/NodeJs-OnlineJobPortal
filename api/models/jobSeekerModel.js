const mongoose = require("mongoose");

const jobSeekerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    education: {
      type: String,
      require: false,
    },
    skills: [
      {
        type: String,
        require: false,
      },
    ],
    workExperience: {
      type: String,
      require: false,
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPosting" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);
