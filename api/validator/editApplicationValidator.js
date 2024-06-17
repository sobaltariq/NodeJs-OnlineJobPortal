const { body } = require("express-validator");

const editApplicationValidationRules = () => {
  return [
    body("status")
      .isIn(["pending", "accepted", "rejected"])
      .withMessage(
        "Status must be one of 'pending', 'accepted', or 'rejected'"
      ),
  ];
};

module.exports = {
  editApplicationValidationRules,
};
