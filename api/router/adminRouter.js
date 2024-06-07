const express = require("express");
const { getAdmin } = require("../controller/adminController");

const router = express.Router();

router.get("/", getAdmin);

module.exports = router;
