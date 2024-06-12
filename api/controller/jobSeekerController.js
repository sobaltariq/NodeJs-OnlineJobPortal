const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jobSeekerModel = require("../models/jobSeekerModel");
const jwt = require("jsonwebtoken");

const getSeeker = (req, res, next) => {
  return res.status(200).json({
    message: "get job seeker",
  });
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

      return res.status(201).json({
        message: "Registered",
        data: savedJobSeeker,
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
        message: "invalid email",
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

      const token = jwt.sign(
        {
          id: seekerFound._id,
          email: seekerFound.email,
          role: seekerFound.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "login job seeker",
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

const deleteSeeker = async (req, res, next) => {
  return res.status(200).json({
    message: "Job Seeker has been deleted",
  });
};

module.exports = {
  getSeeker,
  registerSeeker,
  loginSeeker,
  deleteSeeker,
};
