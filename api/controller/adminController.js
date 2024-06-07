const getAdmin = (req, res, next) => {
  return res.status(200).json({
    message: "get admin",
  });
};

module.exports = {
  getAdmin,
};
