const express = require("express");
const {
  getAllEmployers,
  getEmployerProfile,
  getOneEmployer,
  registerEmployer,
  loginEmployer,
  deleteEmployer,
  changePasswordEmployer,
} = require("../controller/employerController");

const { verifyLoginToken } = require("../middleware/verifyLogin");
const { checkEmployerRole } = require("../middleware/userTypeCheck");
const {
  userRegistrationValidationRules,
} = require("../validator/userValidator");
const validateUser = require("../middleware/validateUser");
const {
  editPasswordValidationRules,
} = require("../validator/passwordValidator");
const {
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getAllJobPostings,
  getMyJobPostings,
  getOneJobPostings,
} = require("../controller/jobPostingController");
const {
  jobPostingValidationRules,
} = require("../validator/jobPostingValidator");
const {
  getApplicationsForJobPosting,
  editApplicationsForJobPosting,
} = require("../controller/applicationController");
const {
  editApplicationValidationRules,
} = require("../validator/editApplicationValidator");

const router = express.Router();

router.get("/profile", verifyLoginToken, checkEmployerRole, getEmployerProfile);

router.get("/", verifyLoginToken, getAllEmployers);

router.get("/:id", verifyLoginToken, getOneEmployer);

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

// Job Posting Management
router.post(
  "/job-postings",
  verifyLoginToken,
  checkEmployerRole,
  jobPostingValidationRules(),
  validateUser,
  createJobPosting
);

router.put(
  "/job-postings/:id",
  verifyLoginToken,
  checkEmployerRole,
  jobPostingValidationRules(),
  validateUser,
  updateJobPosting
);

router.delete(
  "/job-postings/:id",
  verifyLoginToken,
  checkEmployerRole,
  deleteJobPosting
);

router.get(
  "/job-postings/all-jobs",
  verifyLoginToken,
  // checkEmployerRole,
  getAllJobPostings
);

router.get(
  "/job-postings/my-jobs",
  verifyLoginToken,
  checkEmployerRole,
  getMyJobPostings
);

router.get(
  "/job-postings/:id",
  verifyLoginToken,
  checkEmployerRole,
  getOneJobPostings
);

// Application
router.get(
  "/applications/job/:id",
  verifyLoginToken,
  checkEmployerRole,
  getApplicationsForJobPosting
);

router.put(
  "/applications/job/:id/status",
  verifyLoginToken,
  checkEmployerRole,
  editApplicationValidationRules(),
  validateUser,
  editApplicationsForJobPosting
);
module.exports = router;
