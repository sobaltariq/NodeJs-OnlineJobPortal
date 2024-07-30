const jwt = require("jsonwebtoken");
const applicationModel = require("../models/applicationModel");
const jobPostingModel = require("../models/jobPostingModel");
const chatModel = require("../models/chatModel");
const { application } = require("express");
const jobSeekerModel = require("../models/jobSeekerModel");
const employerModel = require("../models/employerModel");

const verifyWSToken = (socket, next) => {
  // postman
  // console.log("Handshake data:", socket.handshake.headers.authorization);
  // const authHeader = socket.handshake.headers.authorization;

  // console.log(socket.handshake.auth.token);
  const authHeader =
    socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new Error("Access denied. No token provided."));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("errs", err.message);
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = decoded;

    console.log("token check done");

    next();
  });
};

const checkWSApplicationStatus = async (socket, next) => {
  try {
    const { id: userId, role: userRole } = socket.user;
    console.log(userId, userRole);
    if (!socket.user) {
      return next(new Error("Authentication error: User not authenticated"));
    }

    if (userRole === "job seeker") {
      await checkJobSeekerApplications(socket, userId, next);
    } else if (userRole === "employer") {
      await checkJobEmployerApplications(socket, userId, next);
    } else {
      return next(new Error("Access denied. Invalid user role."));
    }

    console.log("application check done");

    next();
  } catch (error) {
    next(new Error(`Error checking application status: ${error.message}`));
  }
};

const checkJobSeekerApplications = async (socket, userId, next) => {
  const seekerFound = await jobSeekerModel.findOne({ user: userId });
  if (!seekerFound) {
    return next(new Error("Access denied. Seeker Not Found"));
  }
  const appFound = await applicationModel.find({
    jobSeeker: seekerFound._id,
    status: "accepted",
  });

  if (appFound.length <= 0) {
    return next(new Error("Access denied. No accepted applications found."));
  }

  socket.applications = appFound.map((app) => {
    console.log("seeker applications id", app._id.toString());
    return app._id.toString();
  });
};

const checkJobEmployerApplications = async (socket, userId, next) => {
  const employerFound = await employerModel.findOne({ user: userId });
  if (!employerFound) {
    return next(new Error("Access denied. Employer Not Found"));
  }
  // console.log("employer", employerFound);
  const appFound = await applicationModel.find({
    jobEmployer: employerFound._id,
    status: "accepted",
  });
  // console.log(appFound);

  if (appFound.length <= 0) {
    return next(new Error("Access denied. No accepted applications found."));
  }

  socket.applications = appFound.map((app) => {
    console.log("employer applications id", app._id.toString());
    return app._id.toString();
  });
  // console.log("socket.applications", socket.applications);
};

module.exports = { verifyWSToken, checkWSApplicationStatus };
