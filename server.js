const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const adminRouter = require("./api/router/adminRouter");
const employerRouter = require("./api/router/employerRouter");
const jobSeekerRouter = require("./api/router/jobSeekerRouter");

// for env
require("dotenv").config();

// to use json data (post request data) it display data from body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(`${process.env.DB_URL}`)
  .then(() => {
    console.log(`Mongoose is connected`);
  })
  .catch((err) => {
    console.log(`Error to connect mongoose ${err.message}`);
  });

app.get("/", (req, res, next) => {
  let myIp = req.ip?.replace(/^.*:/, "");
  res.status(200).json({
    message: "Home Page",
    port: `http://${myIp}:${process.env.PORT}`,
  });
});

app.use("/job-seeker", jobSeekerRouter);
app.use("/employer", employerRouter);
app.use("/admin", adminRouter);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Page Not Found!",
    error: "404",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
