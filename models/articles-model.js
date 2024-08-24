const db = require("../db/connection");

exports.selectArticles = (articleId) => {
  if (!Number(articleId)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id=${articleId}`)
    .then((article) => {
      const articlesArray = article.rows;
      if (articlesArray.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return articlesArray[0];
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COALESCE(COUNT(comments.article_id), 0) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC`
    )
    .then((articles) => {
      const articlesArray = articles.rows;
      if (articlesArray.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }

      for (let i = 0; i < articlesArray.length; i++) {
        articlesArray[i].comment_count = Number(articlesArray[i].comment_count);
      }
      return articlesArray;
    });
};

exports.selectComments = (articleId) => {
  if (!Number(articleId)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=${articleId} ORDER BY created_at DESC`
    )
    .then((comments) => {
      const commentsArray = comments.rows;
      if (commentsArray.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return commentsArray;
    });
};
