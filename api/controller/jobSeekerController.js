const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jobSeekerModel = require("../models/jobSeekerModel");
const jwt = require("jsonwebtoken");
const { encryptPassword } = require("../utils/encryptPassword");
const { comparePassword } = require("../utils/comparePassword");
const { generateToken } = require("../utils/jwtTokenUtils");
const chatModel = require("../models/chatModel");
const applicationModel = require("../models/applicationModel");

const getAllSeeker = async (req, res, next) => {
  try {
    const seekerData = await jobSeekerModel
      .find()
      .populate("user")
      .populate("savedJobs");
    if (!seekerData) {
      return res.status(404).json({
        message: "get all seeker not found",
        email: req.user.email,
      });
    }
    const formattedSeekers = seekerData.map((seeker) => ({
      seekerId: seeker._id,
      userId: seeker.user._id,
      role: seeker.user.role,
      name: seeker.user.name,
      email: seeker.user.email,
      createdAt: seeker.user.createdAt,
      skills: seeker.skills,
      education: seeker.education,
      workExperience: seeker.workExperience,
      savedJobs: seeker.savedJobs,
    }));
    return res.status(200).json({
      message: "get all seeker",
      data: formattedSeekers,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting all seeker",
    });
  }
};

const getSeekerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const seekerData = await jobSeekerModel
      .findOne({ user: userId })
      .populate("user");
    if (!seekerData) {
      return res.status(404).json({
        message: "get seeker not found",
        email: req.user.email,
      });
    }

    const formattedJob = {
      seekerId: seekerData._id,
      userId: seekerData.user._id,
      userRole: seekerData.user.role,
      userName: seekerData.user.name,
      userEmail: seekerData.user.email,
      userCreatedAt: seekerData.user.createdAt,
      seekerSkills: seekerData.skills,
      seekerEducation: seekerData.education,
      seekerWorkExperience: seekerData.workExperience,
      seekerSavedJobs: seekerData.savedJobs,
    };
    return res.status(200).json({
      message: "Get seeker profile",
      data: formattedJob,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting seeker",
    });
  }
};

const getOneSeeker = async (req, res, next) => {
  try {
    const seekerId = req.params.id;
    console.log(seekerId);
    const seekerData = await jobSeekerModel
      .findById(seekerId)
      .populate("user")
      .populate("skills")
      .populate("savedJobs");
    if (!seekerData) {
      return res.status(404).json({
        message: "Seeker not found",
        email: req.user.email,
      });
    }
    const formattedJob = {
      seekerId: seekerData._id,
      userId: seekerData.user._id,
      userRole: seekerData.user.role,
      userName: seekerData.user.name,
      userEmail: seekerData.user.email,
      userCreatedAt: seekerData.user.createdAt,
      seekerSkills: seekerData.skills,
      seekerEducation: seekerData.education,
      seekerWorkExperience: seekerData.workExperience,
      seekerSavedJobs: seekerData.savedJobs,
    };
    return res.status(200).json({
      message: "get one seeker",
      data: formattedJob,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting one seeker",
    });
  }
};

const editSeekerProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { education, skills, workExperience } = req.body;
    console.log(req.params.id, req.user.id);
    const seekerFound = await jobSeekerModel.findByIdAndUpdate(
      userId,
      {
        education,
        skills,
        workExperience,
      },
      { new: true }
    );

    if (!seekerFound) {
      return res.status(404).json({ message: "Job Seeker not found" });
    }

    return res.status(201).json({
      message: "Edited seeker profile",
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Something went wrong during editing seeker profile" });
  }
};

const registerSeeker = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(10);

    bcrypt.hash(password, salt, async (err, encryptedPassword) => {
      if (err) {
        res.status(501).json({
          message: "Error To Encrypt Password",
          error: err,
        });
      }
      const newUser = new userModel({
        name,
        email,
        password: encryptedPassword,
        role,
      });

      const alreadyExist = await userModel.findOne({
        email,
      });
      if (alreadyExist) {
        return res.status(400).json({
          error: "job seeker email already exist",
        });
      }
      const savedUser = await newUser.save();

      const jobSeekerData = new jobSeekerModel({
        user: savedUser._id,
      });

      const savedJobSeeker = await jobSeekerData.save();
      const populatedJobSeeker = await jobSeekerModel
        .findById(savedJobSeeker._id)
        .populate("user");

      const token = generateToken({
        id: populatedJobSeeker.user?._id,
        email: populatedJobSeeker.user?.email,
        role: populatedJobSeeker.user?.role,
      });

      return res.status(201).json({
        message: "Registered",
        id: populatedJobSeeker.user?._id,
        email: populatedJobSeeker.user?.email,
        role: populatedJobSeeker.user?.role,
        token,
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when registering admin",
    });
  }
};

const loginSeeker = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const seekerFound = await userModel.findOne({ email, role: "job seeker" });
    if (!seekerFound) {
      return res.status(400).json({
        message: "Invalid Job Seeker Email",
      });
    }

    await bcrypt.compare(password, seekerFound.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "something went wrong when logging in job seeker",
        });
      }
      if (!result) {
        return res.status(400).json({
          message: "wrong password job seeker",
        });
      }
      const token = generateToken({
        id: seekerFound._id,
        email: seekerFound.email,
        role: seekerFound.role,
      });

      return res.status(200).json({
        message: "login job seeker",
        id: seekerFound._id,
        email: seekerFound.email,
        role: seekerFound.role,
        token,
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when login job seeker",
    });
  }
};

const changePasswordSeeker = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const seekerFound = await userModel.findById(userId);

    const passwordsMatch = await comparePassword(
      oldPassword,
      seekerFound.password
    );
    if (!passwordsMatch) {
      return res.status(400).json({
        message: "Wrong current password for seeker",
      });
    } else {
      const hashedPassword = await encryptPassword(newPassword);

      await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

      return res.status(201).json({
        message: "Password Changed",
      });
    }
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Something went wrong during changing password" });
  }
};

const deleteSeeker = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const authUserId = req.user.id;
    console.log(userId, authUserId);
    if (userId !== authUserId) {
      return res.status(403).json({
        message: "Forbidden: You can only delete your own account",
      });
    }

    const userDeleted = await userModel.findByIdAndDelete(userId);
    if (!userDeleted) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const deleteSeeker = await jobSeekerModel.findOneAndDelete({
      user: userId,
    });
    await chatModel.deleteMany({ seeker: deleteSeeker._id });
    await applicationModel.deleteMany({ jobSeeker: deleteSeeker._id });

    return res.status(200).json({
      message: "Job Seeker has been deleted",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Internal server error when deleting user",
    });
  }
};

module.exports = {
  getAllSeeker,
  getSeekerProfile,
  getOneSeeker,
  editSeekerProfile,
  registerSeeker,
  loginSeeker,
  changePasswordSeeker,
  deleteSeeker,
};
