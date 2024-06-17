const { body } = require("express-validator");

const applicationValidationRules = () => {
  return [
    body("jobPosting")
      .isMongoId()
      .withMessage("Invalid job posting ID")
      .notEmpty()
      .withMessage("Job posting ID is required"),
  ];
};

module.exports = {
  applicationValidationRules,
};
