const { body } = require("express-validator");

const jobPostingValidationRules = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("companyName")
      .optional()
      .isString()
      .withMessage("Company name must be a string"),
    body("requirements").isArray().withMessage("Requirements must be an array"),
    body("location")
      .optional()
      .isString()
      .withMessage("Location must be a string"),
    body("salary").optional().isString().withMessage("Salary must be a string"),
  ];
};

module.exports = {
  jobPostingValidationRules,
};
