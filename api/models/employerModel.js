const mongoose = require("mongoose");

const employerSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },

    jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPosting" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
