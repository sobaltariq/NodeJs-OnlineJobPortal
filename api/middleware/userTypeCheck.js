const checkAdminRole = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access forbidden: insufficient rights" });
  }
  next();
};

const checkSeekerRole = (req, res, next) => {
  if (req.user.role !== "job seeker") {
    return res
      .status(403)
      .json({ message: "Access forbidden: insufficient rights" });
  }
  next();
};

const checkEmployerRole = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res
      .status(403)
      .json({ message: "Access forbidden: insufficient rights" });
  }
  next();
};

module.exports = {
  checkAdminRole,
  checkSeekerRole,
  checkEmployerRole,
};
