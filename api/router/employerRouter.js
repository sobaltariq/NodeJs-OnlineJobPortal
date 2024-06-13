const express = require("express");
const {
  getEmployer,
  registerEmployer,
  loginEmployer,
  deleteEmployer,
  changePasswordEmployer,
} = require("../controller/employerController");

const { verifyLoginToken } = require("../middleware/verifyLogin");
const {
  checkSeekerRole,
  checkEmployerRole,
} = require("../middleware/userTypeCheck");
const {
  userRegistrationValidationRules,
} = require("../validator/userValidator");
const validateUser = require("../middleware/validateUser");
const {
  editPasswordValidationRules,
} = require("../validator/passwordValidator");

const router = express.Router();

router.get("/", verifyLoginToken, checkEmployerRole, getEmployer);

router.post(
  "/register",
  userRegistrationValidationRules(),
  validateUser,
  registerEmployer
);

router.post("/login", loginEmployer);

router.put(
  "/change-password",
  verifyLoginToken,
  checkEmployerRole,
  editPasswordValidationRules(),
  validateUser,
  changePasswordEmployer
);

router.delete(
  "/delete/:id",
  verifyLoginToken,
  checkEmployerRole,
  deleteEmployer
);

module.exports = router;
