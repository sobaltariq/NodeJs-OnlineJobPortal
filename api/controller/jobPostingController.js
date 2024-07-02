const employerModel = require("../models/employerModel");
const jobPostingModel = require("../models/jobPostingModel");

const getAllJobPostings = async (req, res, next) => {
  try {
    const jobPostingsFound = await jobPostingModel.find().populate([
      { path: "applications" },
      {
        path: "employer",
        populate: { path: "user" },
      },
    ]);
    if (!jobPostingsFound) {
      return res.status(404).json({
        message: "get all job postings not found",
      });
    }

    const formattedJobs = jobPostingsFound.map((jobPost) => ({
      jobId: jobPost._id,
      jobTitle: jobPost.title,
      jobCreatedAt: jobPost.createdAt,
      jobDescription: jobPost.description,
      jobLocation: jobPost.location,
      jobRequirements: jobPost.requirements,
      jobSalary: jobPost.salary,
      jobCompany: jobPost.companyName,
      employerUserId: jobPost.employer.user._id,
      employerName: jobPost.employer.user.name,
      applications: jobPost.applications.map((app) => ({
        appId: app._id,
        appJobSeeker: app.jobSeeker,
        appStatus: app.status,
        appCreatedAt: app.createdAt,
      })),
    }));

    return res.status(200).json({
      message: "get all job postings",
      data: formattedJobs,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting all job postings",
      message: err.message,
    });
  }
};
const getMyJobPostings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const employerFound = await employerModel.findOne({ user: userId });
    if (!employerFound) {
      return res.status(404).json({
        message: "get my job postings employer not found",
        email: req.user.email,
      });
    }

    const myJobsFound = await jobPostingModel
      .find({
        _id: employerFound.jobPostings,
      })
      .populate([
        { path: "applications" },
        {
          path: "employer",
          populate: { path: "user" },
        },
      ]);
    if (!myJobsFound) {
      return res.status(404).json({
        message: "get my job postings not found",
        email: req.user.email,
      });
    }
    const formattedJobs = myJobsFound.map((jobPost) => ({
      jobId: jobPost._id,
      jobTitle: jobPost.title,
      jobCreatedAt: jobPost.createdAt,
      jobDescription: jobPost.description,
      jobLocation: jobPost.location,
      jobRequirements: jobPost.requirements,
      jobSalary: jobPost.salary,
      jobCompany: jobPost.companyName,
      employerUserId: jobPost.employer.user._id,
      employerName: jobPost.employer.user.name,
      applications: jobPost.applications.map((app) => ({
        appId: app._id,
        appJobSeeker: app.jobSeeker,
        appStatus: app.status,
        appCreatedAt: app.createdAt,
      })),
    }));
    return res.status(200).json({
      message: "get my job postings",
      data: formattedJobs,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting my job postings",
    });
  }
};

const getOneJobPostings = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    console.log(jobId);

    const jobFound = await jobPostingModel.findById(jobId).populate([
      { path: "applications" },
      {
        path: "employer",
        populate: { path: "user" },
      },
    ]);
    if (!jobFound) {
      return res.status(404).json({
        message: "get one job postings not found",
        email: req.user.email,
      });
    }

    const formattedJob = {
      jobId: jobFound._id,
      jobTitle: jobFound.title,
      jobCreatedAt: jobFound.createdAt,
      jobDescription: jobFound.description,
      jobLocation: jobFound.location,
      jobRequirements: jobFound.requirements,
      jobSalary: jobFound.salary,
      jobCompany: jobFound.companyName,
      employerUserId: jobFound.employer.user._id,
      employerName: jobFound.employer.user.name,
      applications: jobFound.applications.map((app) => ({
        appId: app._id,
        appJobSeeker: app.jobSeeker,
        appStatus: app.status,
        appCreatedAt: app.createdAt,
      })),
    };

    return res.status(200).json({
      message: "get one job posting",
      data: formattedJob,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting one job posting",
    });
  }
};

const createJobPosting = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const { title, description, companyName, requirements, location, salary } =
      req.body;

    const employerFound = await employerModel.findOne({ user: req.user.id });
    if (!employerFound) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const newJobPosting = new jobPostingModel({
      employer: employerFound._id,
      title,
      description,
      companyName,
      requirements,
      location,
      salary,
    });

    await newJobPosting.save();
    await employerModel.findByIdAndUpdate(
      employerFound._id,
      { $push: { jobPostings: newJobPosting._id } },
      { new: true }
    );
    return res.status(201).json({
      message: "Job posting created successfully",
      data: employerFound,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when posting job",
    });
  }
};

const updateJobPosting = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    console.log(jobId);
    const { title, description, companyName, requirements, location, salary } =
      req.body;

    const updatedJobPosting = await jobPostingModel.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        companyName,
        requirements,
        location,
        salary,
      },
      { new: true }
    );
    if (!updatedJobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }
    return res.status(201).json({
      message: "Job posting edited successfully",
      data: updatedJobPosting,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when editing posting job",
    });
  }
};

const deleteJobPosting = async (req, res, next) => {
  try {
    userId = req.user.id;
    const jobId = req.params.id;

    console.log(`User ID: ${userId}, Job Posting ID: ${jobId}`);

    const employerFound = await employerModel.findOne({ user: userId });
    if (!employerFound) {
      return res.status(404).json({ message: "Employer not found" });
    }
    const jobFound = await jobPostingModel.findOne({
      _id: jobId,
      employer: employerFound._id,
    });
    if (!jobFound) {
      return res.status(404).json({
        message: "Job posting not found or does not belong to this employer",
      });
    }

    await jobPostingModel.deleteOne({
      _id: jobId,
      employer: employerFound._id,
    });

    await employerModel.updateOne(
      { _id: employerFound._id },
      { $pull: { jobPostings: jobId } }
    );

    return res.status(201).json({
      message: "Deleted job posting",
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Something went wrong during deleting job posting" });
  }
};

module.exports = {
  createJobPosting,
  getAllJobPostings,
  getOneJobPostings,
  updateJobPosting,
  deleteJobPosting,
  getMyJobPostings,
};
