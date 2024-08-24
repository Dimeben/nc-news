const db = require("../db/connection");
const { selectArticles } = require("../models/articles-model");

exports.selectComments = (articleId) => {
  if (!Number.isInteger(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [articleId]
    )
    .then((result) => {
      const comments = result.rows;
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return comments;
    });
};

exports.createComments = (articleId, { username, body }) => {
  if (
    !Number.isInteger(Number(articleId)) ||
    typeof username !== "string" ||
    typeof body !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return selectArticles(articleId)
    .then(() => {
      return db.query(
        `
        INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
        [articleId, username, body]
      );
    })
    .then((result) => {
      const comment = result.rows[0];
      return comment;
    });
};
