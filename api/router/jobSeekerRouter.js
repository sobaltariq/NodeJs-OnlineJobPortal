const express = require("express");
const { getSeeker } = require("../controller/jobSeekerController");

const router = express.Router();

router.get("/", getSeeker);

module.exports = router;
