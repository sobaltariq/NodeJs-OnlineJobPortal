const jwt = require("jsonwebtoken");
const employerModel = require("../models/employerModel");
const userModel = require("../models/userModel");
const { comparePassword } = require("../utils/comparePassword");
const { encryptPassword } = require("../utils/encryptPassword");

const getEmployer = async (req, res, next) => {
  console.log(req.body);
  try {
    const userId = req.user.id;
    const employerData = await employerModel
      .findOne({ user: userId })
      .populate("user");
    if (!employerData) {
      return res.status(404).json({
        message: "get seeker not found",
        email: req.user.email,
      });
    }
    return res.status(200).json({
      message: "get employer",
      data: employerData,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting employer",
    });
  }
};

const registerEmployer = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const encryptedPassword = await encryptPassword(password);
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
        error: "Employer email already exist",
      });
    }
    const savedUser = await newUser.save();

    const employerData = new employerModel({
      user: savedUser._id,
    });

    const savedJobEmployer = await employerData.save();

    return res.status(201).json({
      message: "Registered",
      data: savedJobEmployer,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when registering employer",
    });
  }
};

const loginEmployer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const employerFound = await userModel.findOne({ email, role: "employer" });
    if (!employerFound) {
      return res.status(400).json({
        message: "invalid email",
      });
    }

    const passwordMatch = await comparePassword(
      password,
      employerFound.password
    );
    if (!passwordMatch) {
      return res.status(400).json({
        message: "wrong password employer",
      });
    }
    const token = jwt.sign(
      {
        id: employerFound._id,
        email: employerFound.email,
        role: employerFound.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "login employer",
      token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when login job employer",
    });
  }
};

const changePasswordEmployer = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const employerFound = await userModel.findById(userId);

    const passwordsMatch = await comparePassword(
      oldPassword,
      employerFound.password
    );
    if (!passwordsMatch) {
      return res.status(400).json({
        message: "wrong current password for employer",
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

const deleteEmployer = async (req, res, next) => {
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
    await employerModel.findOneAndDelete({ user: userId });

    return res.status(200).json({
      message: "Employer has been deleted",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Internal server error when deleting user",
    });
  }
};

module.exports = {
  getEmployer,
  registerEmployer,
  loginEmployer,
  changePasswordEmployer,
  deleteEmployer,
};
