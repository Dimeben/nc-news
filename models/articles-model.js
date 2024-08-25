const db = require("../db/connection");

exports.selectArticles = (articleId) => {
  if (!Number.isInteger(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
       COALESCE(COUNT(comments.article_id), 0) AS comment_count 
       FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id;
    `,
      [articleId]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return article;
    });
};

exports.selectAllArticles = (
  sortBy = "created_at",
  order = "DESC",
  topic = "all"
) => {
  let baseQuery = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COALESCE(COUNT(comments.article_id), 0) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryParams = [];
  if (topic !== "all") {
    baseQuery += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  baseQuery += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order}`;

  return db.query(baseQuery, queryParams).then((result) => {
    return result.rows;
  });
};

exports.updateArticleVotes = (articleId, votes) => {
  if (typeof articleId !== "number" || typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return exports
    .selectArticles(articleId)
    .then(() => {
      return db.query(
        `UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *`,
        [votes, articleId]
      );
    })
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return article;
    });
};

exports.createArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `
      INSERT INTO articles (author, title, body, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [author, title, body, topic, article_img_url]
    )
    .then((result) => {
      const article = result.rows[0];

      return db.query(
        `
        SELECT articles.*, COALESCE(COUNT(comments.article_id), 0) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
      `,
        [article.article_id]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};
