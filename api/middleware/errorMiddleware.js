const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((value) => value.message)
      .join("\n");
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered`;
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please login again";
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
  } else {
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      stack: err.stack,
    });
  }
};

export default errorMiddleware;
