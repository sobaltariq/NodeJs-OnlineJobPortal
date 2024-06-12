const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  encryptPassword,
};
