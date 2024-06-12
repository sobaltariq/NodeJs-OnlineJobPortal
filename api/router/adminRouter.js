const express = require("express");
const {
  getAdmin,
  registerAdmin,
  loginAdmin,
  changePasswordAdmin,
  logoutAdmin,
} = require("../controller/adminController");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { checkAdminRole } = require("../middleware/userTypeCheck");
const {
  userRegistrationValidationRules,
} = require("../validator/userValidator");
const validateUser = require("../middleware/validateUser");
const {
  editPasswordValidationRules,
} = require("../validator/passwordValidator");

const router = express.Router();

router.get("/", verifyLoginToken, checkAdminRole, getAdmin);

router.post(
  "/register",
  userRegistrationValidationRules(),
  validateUser,
  registerAdmin
);

router.post("/login", loginAdmin);

router.put(
  "/change-password",
  verifyLoginToken,
  checkAdminRole,
  editPasswordValidationRules(),
  validateUser,
  changePasswordAdmin
);

router.post("/logout", verifyLoginToken, logoutAdmin);

module.exports = router;
