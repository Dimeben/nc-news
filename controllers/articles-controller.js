const {
  selectArticles,
  selectAllArticles,
  selectComments,
} = require("../models/articles-model");

exports.getArticles = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticles(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const articleId = req.params.article_id;
  selectComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
