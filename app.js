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
const {
  getArticles,
  getAllArticles,
  getComments,
} = require("./controllers/articles-controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApis);

app.get("/api/articles/:article_id", getArticles);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getComments);

//Error Handlers:

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(postErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
