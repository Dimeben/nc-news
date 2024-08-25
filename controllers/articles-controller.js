const { sort } = require("../db/data/test-data/articles");
const {
  selectArticles,
  selectAllArticles,
  updateArticleVotes,
} = require("../models/articles-model");

const validSortBy = [
  "author",
  "title",
  "article_id",
  "topic",
  "created_at",
  "votes",
  "comment_count",
];
const validOrder = ["ASC", "DESC"];

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
  let sortBy = "";
  let order = "";
  if (Object.keys(req.query).length === 0) {
    sortBy = "created_at";
    order = "DESC";
  } else {
    sortBy = req.query.sort_by;
    order = req.query.order.toUpperCase();
  }

  if (!validSortBy.includes(sortBy) || !validOrder.includes(order)) {
    return next({ status: 400, msg: "Bad request" });
  }

  selectAllArticles(sortBy, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const articleId = Number(req.params.article_id);
  const votes = req.body.inc_votes;
  updateArticleVotes(articleId, votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
