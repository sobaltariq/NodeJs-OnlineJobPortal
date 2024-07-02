const applicationModel = require("../models/applicationModel");
const chatModel = require("../models/chatModel");
const employerModel = require("../models/employerModel");
const jobPostingModel = require("../models/jobPostingModel");
const jobSeekerModel = require("../models/jobSeekerModel");

// For seeker
const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const seekerFound = await jobSeekerModel.findOne({ user: userId });
    if (!seekerFound) {
      return res.status(404).json({
        message: "get my job applications seeker not found",
        email: req.user.email,
      });
    }

    const applicationFound = await applicationModel
      .find({
        jobSeeker: seekerFound._id,
      })
      .populate([
        { path: "jobPosting" },
        {
          path: "jobSeeker",
          populate: { path: "user" },
        },
      ]);
    if (!applicationFound) {
      return res.status(404).json({
        message: "get my job applications not found",
        email: req.user.email,
      });
    }

    const formattedApplications = applicationFound.map((app) => ({
      appDate: app.createdAt,
      appStatus: app.status,
      jobId: app.jobPosting._id,
      jobTitle: app.jobPosting.title,
      jobCreatedAt: app.jobPosting.createdAt,
    }));

    return res.status(200).json({
      message: "get my job applications",
      data: formattedApplications,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting my job applications",
    });
  }
};

const applyJobApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.body.jobPosting;
    console.log(userId, jobId);

    const seekerFound = await jobSeekerModel.findOne({ user: userId });
    if (!seekerFound) {
      return res.status(404).json({ message: "Seeker not found" });
    }

    const jobFound = await jobPostingModel.findById(jobId);
    if (!jobFound) {
      return res.status(404).json({ message: "Job not found" });
    }

    const isAlreadyApplied = await applicationModel.findOne({
      jobSeeker: seekerFound._id,
      jobPosting: jobFound._id,
    });
    if (isAlreadyApplied) {
      return res.status(404).json({ message: "Already has applied" });
    }

    const newApplication = new applicationModel({
      jobSeeker: seekerFound._id,
      jobPosting: jobFound._id,
    });

    await newApplication.save();
    await jobPostingModel.findByIdAndUpdate(
      jobId,
      { $push: { applications: newApplication._id } },
      { new: true }
    );
    return res.status(201).json({
      message: "Job application submitted successfully",
      // data: newApplication,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when applying for job",
    });
  }
};

// for Employer
const getApplicationsForJobPosting = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobPostingId = req.params.id;
    console.log(userId, jobPostingId);
    const employerFound = await employerModel.findOne({
      user: userId,
    });
    if (!employerFound) {
      return res.status(404).json({
        message: "Employer not found or unauthorized",
      });
    }
    const jobPostingFound = await jobPostingModel.findOne({
      _id: jobPostingId,
      employer: employerFound._id,
    });
    if (!jobPostingFound) {
      return res.status(404).json({
        message: "Job posting not found or unauthorized",
      });
    }
    const applicationData = await applicationModel
      .find({
        _id: { $in: jobPostingFound.applications },
      })
      .populate("jobSeeker");
    return res.status(404).json({
      message: "Job posting Applications",
      data: applicationData,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      message:
        "Internal server error when getting applications for my job posting",
    });
  }
};

const editApplicationsForJobPosting = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const status = req.body.status;

    const applicationFound = await applicationModel
      .findById(applicationId)
      .populate({
        path: "jobPosting",
        populate: [
          {
            path: "employer",
            model: "Employer",
          },
          {
            path: "employer",
            populate: {
              path: "user",
              model: "User",
            },
          },
        ],
      });
    if (!applicationFound) {
      return res.status(404).json({
        message: "Application not found",
      });
    }
    console.log(
      applicationFound.jobPosting.employer.user._id.toString(),
      userId
    );
    if (applicationFound.jobPosting.employer.user._id.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    if (applicationFound.status === status) {
      return res.status(400).json({
        message: `Application is already ${status}`,
      });
    }
    await applicationModel.findByIdAndUpdate(
      applicationFound._id,
      { $set: { status } },
      { new: true }
    );

    res.status(501).json({
      message: "Successfully edited application",
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      message:
        "Internal server error when getting applications for my job posting",
    });
  }
};
module.exports = {
  applyJobApplication,
  getMyApplications,
  getApplicationsForJobPosting,
  editApplicationsForJobPosting,
};
