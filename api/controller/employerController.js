const getEmployer = (req, res, next) => {
  return res.status(200).json({
    message: "get employer",
  });
};

module.exports = {
  getEmployer,
};
