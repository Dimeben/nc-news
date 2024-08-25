const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
  invalidInputErrorHandler,
  invalidIdErrorHandler,
} = require("./error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

// Error Handlers
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});
app.use(psqlErrorHandler);
app.use(invalidInputErrorHandler);
app.use(invalidIdErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
