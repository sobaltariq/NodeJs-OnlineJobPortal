const { body } = require("express-validator");

const createChatValidationRules = () => {
  return [
    body("application")
      .isMongoId()
      .withMessage("Invalid application ID")
      .notEmpty()
      .withMessage("Application ID is required"),
    body("employer")
      .isMongoId()
      .withMessage("Invalid employer ID")
      .notEmpty()
      .withMessage("Employer ID is required"),
    body("seeker")
      .isMongoId()
      .withMessage("Invalid job seeker ID")
      .notEmpty()
      .withMessage("Job seeker ID is required"),
    body("message")
      .notEmpty()
      .withMessage("Message is required")
      .isString()
      .withMessage("Message must be a string"),
  ];
};

module.exports = {
  createChatValidationRules,
};
