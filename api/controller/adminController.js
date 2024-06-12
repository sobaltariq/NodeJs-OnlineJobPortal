const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");

const getAdmin = async (req, res, next) => {
  try {
    const adminData = await adminModel.findOne().populate("user");
    if (!adminData) {
      return res.status(404).json({
        message: "get admin not found",
        email: req.email,
      });
    }
    return res.status(200).json({
      message: "get admin",
      data: adminData,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting admin",
    });
  }
};

const registerAdmin = async (req, res, next) => {
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
      const newAdmin = new userModel({
        name,
        email,
        password: encryptedPassword,
        role,
      });

      const alreadyExist = await userModel.findOne({ email, role: "admin" });
      if (alreadyExist) {
        return res.status(400).json({
          error: "admin already exist",
        });
      }
      const savedUser = await newAdmin.save();

      // Create a new admin with reference to the user
      const saveAdmin = new adminModel({
        user: savedUser._id,
      });

      await saveAdmin.save();

      return res.status(201).json({
        message: "Registered",
        data: {
          name,
          email,
          role,
        },
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when registering admin",
    });
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const adminFound = await userModel.findOne({ email, role: "admin" });
    if (!adminFound) {
      return res.status(400).json({
        message: "invalid email",
      });
    }

    await bcrypt.compare(password, adminFound.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "something went wrong when logging in admin",
        });
      }
      if (!result) {
        return res.status(400).json({
          message: "wrong password admin",
        });
      }

      const token = jwt.sign(
        { id: adminFound._id, email: adminFound.email, role: adminFound.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "login admin",
        token,
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when login admin",
    });
  }
};

const logoutAdmin = async (req, res, next) => {
  try {
    return res.status(200).json({
      message: "admin logged out",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something went wrong during logout" });
  }
};
module.exports = {
  getAdmin,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
};
