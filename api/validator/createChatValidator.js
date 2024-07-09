const { body } = require("express-validator");

const createChatValidationRules = () => {
  return [
    body("application")
      .notEmpty()
      .withMessage("Application ID is required")
      .isMongoId()
      .withMessage("Invalid application ID"),
    body("employer")
      .notEmpty()
      .withMessage("Employer ID is required")
      .isMongoId()
      .withMessage("Invalid employer ID"),
    body("seeker")
      .notEmpty()
      .withMessage("Job seeker ID is required")
      .isMongoId()
      .withMessage("Invalid job seeker ID"),
    body("messages")
      .isArray({ min: 1 })
      .withMessage("At least one message is required")
      .custom((messages) => {
        // Validate each message in the array
        return messages.every((message) => {
          return (
            typeof message.content === "string" &&
            message.content.trim().length > 0
          );
        });
      })
      .withMessage("Each message must have non-empty content"),
  ];
};

module.exports = {
  createChatValidationRules,
};
