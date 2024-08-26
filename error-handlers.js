exports.psqlErrorHandler = (err, req, res, next) => {
  console.log("Error in PSQL Error Handler:", err);
  if (err.code === "22P02") {
    console.log(err, "<----------- PSQL Error Handler");
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.invalidInputErrorHandler = (err, req, res, next) => {
  if (err.code === "23502") {
    console.log(err, "<----------- Invalid Input Error Handler");
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.invalidIdErrorHandler = (err, req, res, next) => {
  if (err.code === "23503") {
    console.log(err, "<----------- Invalid Page Error Handler");
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
  console.log(err, "<----------- Invalid Input Error Handler");
  res.status(500).send({ msg: "500: Internal server error!" });
};
