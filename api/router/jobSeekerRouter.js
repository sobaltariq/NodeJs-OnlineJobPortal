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
const {
  applicationValidationRules,
} = require("../validator/applicationValidator");
const {
  applyJobApplication,
  getMyApplications,
} = require("../controller/applicationController");

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

router.get("/:id", verifyLoginToken, getOneSeeker);

router.put(
  "/profile/:id",
  verifyLoginToken,
  checkSeekerRole,
  editSeekerValidationRules(),
  validateUser,
  editSeekerProfile
);

router.delete("/delete/:id", verifyLoginToken, checkSeekerRole, deleteSeeker);

// Application Routes for Job Seeker
router.post(
  "/application",
  verifyLoginToken,
  checkSeekerRole,
  applicationValidationRules(),
  validateUser,
  applyJobApplication
);

router.get(
  "/application/my-applications",
  verifyLoginToken,
  checkSeekerRole,
  getMyApplications
);

module.exports = router;
