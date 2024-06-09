const express = require("express");
const {
  getSeeker,
  registerSeeker,
  loginSeeker,
  deleteSeeker,
} = require("../controller/jobSeekerController");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { checkSeekerRole } = require("../middleware/userTypeCheck");

const router = express.Router();

router.get("/", verifyLoginToken, checkSeekerRole, getSeeker);

router.post("/register", registerSeeker);

router.post("/login", loginSeeker);

router.delete("/delete/:id", deleteSeeker);

module.exports = router;
