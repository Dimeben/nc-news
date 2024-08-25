const articlesRouter = require("express").Router();
const {
  getArticles,
  getAllArticles,
  patchArticleVotes,
} = require("../controllers/articles-controller");
const {
  getComments,
  postComments,
} = require("../controllers/comments-controller");

articlesRouter.route("/:article_id").get(getArticles).patch(patchArticleVotes);
articlesRouter.get("/", getAllArticles);
articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComments);

module.exports = articlesRouter;
