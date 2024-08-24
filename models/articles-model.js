const db = require("../db/connection");

exports.selectArticles = (article_id) => {
  if (!Number(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id=${article_id}`)
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return article.rows[0];
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
