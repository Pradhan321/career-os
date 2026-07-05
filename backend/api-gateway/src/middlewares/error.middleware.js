const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.response) {
    return res.status(err.response.status).json(err.response.data);
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;