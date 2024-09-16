const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
  invalidInputErrorHandler,
  invalidIdErrorHandler,
  invalidDataErrorHandler,
} = require("./error-handlers");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
