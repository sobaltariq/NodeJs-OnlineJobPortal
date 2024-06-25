const { body } = require("express-validator");

const editPasswordValidationRules = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New Password must be at least 8 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/
      )
      .withMessage(
        "New Password must contain an uppercase letter, a lowercase letter, a number, and a special character"
      )
      .custom((value, { req }) => {
        if (value === req.body.oldPassword) {
          throw new Error(
            "New password should not be the same as the old password"
          );
        }
        return true;
      }),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ];
};

module.exports = {
  editPasswordValidationRules,
};
