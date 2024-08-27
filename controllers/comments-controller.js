const {
  selectComments,
  createComments,
  removeComment,
  updateComment,
} = require("../models/comments-model");

exports.getComments = (req, res, next) => {
  const articleId = req.params.article_id;
  const limit =
    req.query.limit === undefined || req.query.limit === ""
      ? 10
      : parseInt(req.query.limit, 10);
  const page =
    req.query.p === undefined || req.query.p === ""
      ? 1
      : parseInt(req.query.p, 10);

  selectComments(articleId, limit, page)
    .then(({ comments, total_count }) => {
      res.status(200).send({ comments, total_count });
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
      console.log(err);
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
