const express = require("express");
const {
  getAdmin,
  registerAdmin,
  loginAdmin,
} = require("../controller/adminController");
const verifyToken = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", verifyToken, getAdmin);

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

module.exports = router;
