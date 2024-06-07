const mongoose = require("mongoose");

const jobPostingSchema = mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    require: true,
  },
  title: { type: String, required: true },
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      type: String,
      required: false,
    },
  ],
  location: {
    type: String,
    required: false,
  },
  salary: {
    type: String,
    required: false,
  },
  dataPosted: {
    type: Date,
    default: Date.now,
  },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
});

module.exports = mongoose.model("JobPosting", jobPostingSchema);
