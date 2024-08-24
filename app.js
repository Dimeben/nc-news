const express = require("express");
const app = express();
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
  invalidInputErrorHandler,
  invalidIdErrorHandler,
} = require("./error-handlers");
const { getTopics } = require("./controllers/topics-controller");
const { getApis } = require("./controllers/api-controller");
const {
  getArticles,
  getAllArticles,
  patchArticleVotes,
} = require("./controllers/articles-controller");
const {
  getComments,
  postComments,
} = require("./controllers/comments-controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApis);
app.get("/api/articles/:article_id", getArticles);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComments);
app.patch("/api/articles/:article_id", patchArticleVotes);

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
