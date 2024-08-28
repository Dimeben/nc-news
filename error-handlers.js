exports.psqlErrorHandler = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
    case "23502":
    case "42601":
      res.status(400).send({ msg: "Bad request" });
      break;

    case "42P01":
    case "23503":
    case "23504":
    case "42703":
      res.status(404).send({ msg: "Page not found" });
      break;

    default:
      next(err);
      break;
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "500: Internal server error!" });
};
