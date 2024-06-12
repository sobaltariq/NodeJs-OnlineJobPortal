const express = require("express");
const {
  getAdmin,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controller/adminController");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { checkAdminRole } = require("../middleware/userTypeCheck");
const {
  userRegistrationValidationRules,
} = require("../validator/userValidator");
const validateUser = require("../middleware/validateUser");

const router = express.Router();

router.get("/", verifyLoginToken, checkAdminRole, getAdmin);

router.post(
  "/register",
  userRegistrationValidationRules(),
  validateUser,
  registerAdmin
);

router.post("/login", loginAdmin);

router.post("/logout", verifyLoginToken, logoutAdmin);

module.exports = router;
