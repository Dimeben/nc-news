const db = require("../db/connection");
const { selectArticles } = require("../models/articles-model");

exports.selectComments = (articleId, limit = 10, page = 1) => {
  if (isNaN(articleId)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const offset = (page - 1) * limit;

  return db
    .query(
      `SELECT *, COUNT(*) OVER() AS total_count 
       FROM comments 
       WHERE article_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [articleId, limit, offset]
    )
    .then((result) => {
      const total_count =
        result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;

      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }

      return { comments: result.rows, total_count };
    });
};

exports.createComments = (articleId, { username, body }) => {
  if (
    isNaN(articleId) ||
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
  if (isNaN(commentId)) {
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
  if (isNaN(commentId) || isNaN(votes)) {
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
