const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getAdmin = (req, res, next) => {
  try {
    return res.status(200).json({
      message: "get admin",
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
    console.log(name);
    // Password Complexity Check
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

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

      const alreadyExist = await userModel.findOne({ email, role });
      if (alreadyExist) {
        return res.status(400).json({
          error: "admin already exist",
        });
      }
      newAdmin.save();
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

module.exports = {
  getAdmin,
  registerAdmin,
  loginAdmin,
};
