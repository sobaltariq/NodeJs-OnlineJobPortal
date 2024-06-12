const bcrypt = require("bcrypt");

const comparePassword = async (password, encryptedPassword) => {
  try {
    return await bcrypt.compare(password, encryptedPassword);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  comparePassword,
};
