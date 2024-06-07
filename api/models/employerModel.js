const mongoose = require("mongoose");

const employerSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  companyName: {
    type: String,
    require: false,
  },
  companyInfo: {
    type: String,
    require: false,
  },
  jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPosting" }],
});

module.exports = mongoose.model("Employer", employerSchema);
