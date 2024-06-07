const express = require("express");
const { getEmployer } = require("../controller/employerController");

const router = express.Router();

router.get("/", getEmployer);

module.exports = router;
