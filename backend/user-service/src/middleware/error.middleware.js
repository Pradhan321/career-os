const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Duplicate Key Error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Profile already exists for this user.",
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors,
    });
  }

  // Cast Error (Invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }

  // Default Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;