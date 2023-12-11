const errorMiddleware = (err, req, res, next) => {
  if (typeof err == "object") {
    err.statusCode = err.statusCode || 500;

    if (process.env.MODE.toLowerCase() === "development") {
      console.log(err);
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
      });
    } else
      res.status(err.statusCode).json({
        sucess: false,
        message: err.message,
      });
    return;
  }
  const defaultError = {
    statusCode: 404,
    success: "failed",
    message: err,
  };
  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

export default errorMiddleware;
