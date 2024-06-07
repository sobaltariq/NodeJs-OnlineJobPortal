const getSeeker = (req, res, next) => {
  return res.status(200).json({
    message: "get job seeker",
  });
};

module.exports = {
  getSeeker,
};
