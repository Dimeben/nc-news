const articlesRouter = require("express").Router();
const {
  getArticles,
  getAllArticles,
  patchArticleVotes,
  postArticle,
} = require("../controllers/articles-controller");
const {
  getComments,
  postComments,
} = require("../controllers/comments-controller");

articlesRouter.route("/:article_id").get(getArticles).patch(patchArticleVotes);
articlesRouter.route("/").get(getAllArticles).post(postArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComments);

module.exports = articlesRouter;
