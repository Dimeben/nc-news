const express = require("express");
const app = express();
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
  postErrorHandler,
} = require("./error-handlers");
const { getTopics } = require("./controllers/topics-controller");
const { getApis } = require("./controllers/api-controller");

app.get("/api/topics", getTopics);

app.get("/api", getApis);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(postErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
