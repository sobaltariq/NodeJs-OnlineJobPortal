const express = require("express");
const {
  getAdmin,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controller/adminController");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { checkAdminRole } = require("../middleware/userTypeCheck");

const router = express.Router();

router.get("/", verifyLoginToken, checkAdminRole, getAdmin);

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.post("/logout", verifyLoginToken, logoutAdmin);

module.exports = router;
