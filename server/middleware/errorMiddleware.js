const errorMiddleware = (err, req, res, next) => {
  if (typeof err == "object") {
    err.statusCode = err.statusCode || 500;
    console.log("Async Middleware Running");

    if (process.env.MODE.toLowerCase() === "development") {
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

  console.log("Running Custom Error", err);

  const defaultError = {
    statusCode: 404,
    success: "failed",
    message: err,
  };
  // res.status(500).json({
  //   success: ,
  //   message: err,
  // });
  res.json({
    success: "failed",
    message: err,
  });
};

export default errorMiddleware;
