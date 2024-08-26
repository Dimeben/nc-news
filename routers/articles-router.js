const articlesRouter = require("express").Router();
const {
  getArticle,
  getAllArticles,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/articles-controller");
const {
  getComments,
  postComments,
} = require("../controllers/comments-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .delete(deleteArticle);
articlesRouter.route("/").get(getAllArticles).post(postArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComments);

module.exports = articlesRouter;
