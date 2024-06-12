const { body } = require("express-validator");

const userRegistrationValidationRules = () => {
  return [
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .notEmpty()
      .withMessage("Email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/
      )
      .withMessage(
        "Password must contain an uppercase letter, a lowercase letter, a number, and a special character"
      ),
    body("role")
      .isIn(["job seeker", "employer", "admin"])
      .withMessage("Invalid role"),
  ];
};

module.exports = {
  userRegistrationValidationRules,
};
