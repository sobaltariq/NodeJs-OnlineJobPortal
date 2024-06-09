const getEmployer = (req, res, next) => {
  return res.status(200).json({
    message: "get employer",
  });
};

const registerEmployer = (req, res, next) => {
  return res.status(200).json({
    message: "get job seeker",
  });
};

module.exports = {
  getEmployer,
  registerEmployer,
};
