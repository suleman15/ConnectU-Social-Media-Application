const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: 404,
    success: "failed",
    message: err,
  };
  if (err?.name === "ValidationError") {
    defaultError.statusCode = 404;
    defaultError.message = Object.values(err, errors)
      .map((el) => el.message)
      .join(",");
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = 404;
    defaultError.message = `${Object.values(
      err.keyValue
    )} fields has to be unique !`;
  }
  console.log(defaultError.message);

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};
const handleError = (err, req, res, next) => {
  console.log("HandleError is Running");
  console.log(`The Error Is : ${err}`, err.stack);
  err.statusCode = err.statusCode || 500;
  if (process.env.MODE.toLowerCase() === "development")
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  else
    res.status(err.statusCode).json({
      sucess: false,
      message: err.message,
    });
};

export default errorMiddleware;
export { handleError };
