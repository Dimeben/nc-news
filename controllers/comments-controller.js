const {
  selectComments,
  createComments,
  removeComment,
  updateComment,
} = require("../models/comments-model");

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

exports.postComments = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;
  createComments(articleId, { username, body })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeComment(commentId)
    .then(() => {
      res.status(204).send({ msg: "Comment deleted" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  const votes = req.body.inc_votes;
  updateComment(commentId, votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
