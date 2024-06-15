const { body } = require("express-validator");

const editSeekerValidationRules = () => {
  return [
    body("education").optional().isString(),
    body("skills").optional().isArray(),
    body("workExperience").optional().isString(),
  ];
};

module.exports = {
  editSeekerValidationRules,
};
