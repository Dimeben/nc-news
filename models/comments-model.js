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

exports.removeComment = (commentId) => {
  if (!Number.isInteger(Number(commentId))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return exports
    .selectComments(commentId)
    .then(() => {
      return db.query(`DELETE FROM comments WHERE comment_id = $1`, [
        commentId,
      ]);
    })
    .then(() => {
      return;
    });
};

exports.updateComment = (commentId, votes) => {
  if (!Number(commentId) || !Number(votes)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return exports
    .selectComments(commentId)
    .then(() => {
      return db.query(
        `UPDATE comments SET votes = votes+$1 WHERE comment_id = $2 RETURNING *`,
        [votes, commentId]
      );
    })
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return comment;
    });
};
