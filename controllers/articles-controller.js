const { sort } = require("../db/data/test-data/articles");
const {
  selectArticles,
  selectAllArticles,
  updateArticleVotes,
  createArticle,
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
const validTopic = ["mitch", "cats", "paper", "all"];
const isValidString = (value) =>
  typeof value === "string" && value.trim().length > 0;

exports.getArticles = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticles(articleId)
    .then((article) => {
      article.article_id = +article.article_id;
      article.votes = +article.votes;
      article.comment_count = +article.comment_count;

      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  let topic = req.query.topic ? req.query.topic : "all";
  let sortBy = req.query.sort_by ? req.query.sort_by : "created_at";
  let order = req.query.order ? req.query.order.toUpperCase() : "DESC";

  if (
    !validSortBy.includes(sortBy) ||
    !validOrder.includes(order) ||
    !validTopic.includes(topic)
  ) {
    return next({ status: 400, msg: "Bad request" });
  }

  selectAllArticles(sortBy, order, topic)
    .then((articles) => {
      articles.forEach((article) => {
        article.article_id = +article.article_id;
        article.votes = +article.votes;
        article.comment_count = +article.comment_count;
      });
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

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  if (
    !isValidString(author) ||
    !isValidString(title) ||
    !isValidString(body) ||
    !isValidString(topic) ||
    !isValidString(article_img_url)
  ) {
    return next({ status: 400, msg: "Bad request" });
  }

  createArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      article.comment_count = Number(article.comment_count);
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
