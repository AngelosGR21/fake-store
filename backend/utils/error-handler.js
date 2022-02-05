const ApiError = require("./error");

const apiErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({
      request: false,
      message: err.message,
    });
    return;
  }

  return res.status(500).json({
    request: false,
    message: "Something went wrong",
  });
};

module.exports = apiErrorHandler;
