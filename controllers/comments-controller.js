const { selectComments, createComments } = require("../models/comments-model");

exports.getComments = (req, res, next) => {
  const articleId = req.params.article_id;
  selectComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComments = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;
  createComments(articleId, { username, body })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
