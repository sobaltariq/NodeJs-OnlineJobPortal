const express = require("express");
const {
  getEmployerProfile,
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

const router = express.Router();

router.get("/profile", verifyLoginToken, checkEmployerRole, getEmployerProfile);

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
  checkEmployerRole,
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
module.exports = router;
