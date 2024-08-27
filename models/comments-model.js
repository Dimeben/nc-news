const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

exports.selectComments = (articleId, limit = 10, page = 1) => {
  const offset = (page - 1) * limit;

  const checkArticleExists = checkExists("articles", "article_id", articleId);
  const fetchComments = db.query(
    `SELECT *, COUNT(*) OVER() AS total_count 
     FROM comments 
     WHERE article_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [articleId, limit, offset]
  );

  return Promise.all([checkArticleExists, fetchComments]).then((results) => {
    const commentsResult = results[1];
    const total_count =
      commentsResult.rows.length > 0
        ? parseInt(commentsResult.rows[0].total_count, 10)
        : 0;
    return { comments: commentsResult.rows, total_count };
  });
};

exports.createComments = (articleId, { username, body }) => {
  let queryStr = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3)
        RETURNING *`;
  const queryValues = [articleId, username, body];

  const checkArticleExists = checkExists("articles", "article_id", articleId);
  const makeComment = db.query(queryStr, queryValues);

  return Promise.all([checkArticleExists, makeComment]).then((result) => {
    return result[1].rows[0];
  });
};

exports.removeComment = (commentId) => {
  let queryStr = `DELETE FROM comments WHERE comment_id = $1`;
  const queryValues = [commentId];

  const checkCommentExists = checkExists("comments", "comment_id", commentId);
  const deleteComment = db.query(queryStr, queryValues);

  return Promise.all([checkCommentExists, deleteComment]).then((result) => {
    return;
  });
};

exports.updateComment = (commentId, votes) => {
  let queryStr = `UPDATE comments SET votes = votes+$1 WHERE comment_id = $2 RETURNING *`;
  const queryValues = [votes, commentId];

  const checkCommentExists = checkExists("comments", "comment_id", commentId);
  const updateVotes = db.query(queryStr, queryValues);

  return Promise.all([checkCommentExists, updateVotes]).then((result) => {
    const comment = result[1].rows[0];
    return comment;
  });
};
