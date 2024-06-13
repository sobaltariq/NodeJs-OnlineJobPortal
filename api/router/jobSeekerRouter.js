const express = require("express");
const {
  getSeeker,
  registerSeeker,
  loginSeeker,
  deleteSeeker,
  changePasswordSeeker,
} = require("../controller/jobSeekerController");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { checkSeekerRole } = require("../middleware/userTypeCheck");
const {
  userRegistrationValidationRules,
} = require("../validator/userValidator");
const validateUser = require("../middleware/validateUser");
const {
  editPasswordValidationRules,
} = require("../validator/passwordValidator");

const router = express.Router();

router.get("/", verifyLoginToken, checkSeekerRole, getSeeker);

router.post(
  "/register",
  userRegistrationValidationRules(),
  validateUser,
  registerSeeker
);

router.post("/login", loginSeeker);

router.put(
  "/change-password",
  verifyLoginToken,
  checkSeekerRole,
  editPasswordValidationRules(),
  validateUser,
  changePasswordSeeker
);

router.delete("/delete/:id", verifyLoginToken, checkSeekerRole, deleteSeeker);

module.exports = router;
