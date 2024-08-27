exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.invalidInputErrorHandler = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.invalidIdErrorHandler = (err, req, res, next) => {
  if (err.code === "23503") {
    console.log(err.detail);
    res.status(404).send({ msg: "Page not found" });
  } else {
    next(err);
  }
};

exports.invalidDataErrorHandler = (err, req, res, next) => {
  if (err.code === "23504") {
    res.status(404).send({ msg: "Page not found" });
  } else {
    next(err);
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
  res.status(500).send({ msg: "500: Internal server error!" });
};
