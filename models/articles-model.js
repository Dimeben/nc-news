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
