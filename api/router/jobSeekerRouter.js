const express = require("express");
const {
  getAllSeeker,
  getSeekerProfile,
  getOneSeeker,
  editSeekerProfile,
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
const {
  editSeekerValidationRules,
} = require("../validator/editSeekerValidator");

// ##### start here #####
const router = express.Router();

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

router.get("/profile", verifyLoginToken, checkSeekerRole, getSeekerProfile);

router.get("/", verifyLoginToken, checkSeekerRole, getAllSeeker);

router.get("/:id", verifyLoginToken, checkSeekerRole, getOneSeeker);

router.put(
  "/profile/:id",
  verifyLoginToken,
  checkSeekerRole,
  editSeekerValidationRules(),
  validateUser,
  editSeekerProfile
);

router.delete("/delete/:id", verifyLoginToken, checkSeekerRole, deleteSeeker);

module.exports = router;
