const {
  selectArticle,
  selectAllArticles,
  updateArticleVotes,
  createArticle,
  removeArticle,
} = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticle(articleId)
    .then((article) => {
      article.comment_count = +article.comment_count;
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  let topic = req.query.topic ? req.query.topic : null;
  console.log(req.query);
  let sortBy = req.query.sort_by ? req.query.sort_by : "created_at";
  let order = req.query.order ? req.query.order.toUpperCase() : "DESC";
  let limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  let page = req.query.p ? parseInt(req.query.p, 10) : 1;

  console.log(sortBy, order, limit, page, topic, "controller");

  selectAllArticles(sortBy, order, limit, page, topic)
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
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

  createArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      article.comment_count = Number(article.comment_count);
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const article_Id = req.params.article_id;

  removeArticle(article_Id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
};
