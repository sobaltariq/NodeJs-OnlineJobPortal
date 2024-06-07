const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["seeker", "employer", "admin"],
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
