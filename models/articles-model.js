const db = require("../db/connection");
const { checkExists, checkValidColumns } = require("../utils/utils");

exports.selectArticle = (articleId) => {
  let queryStr = `SELECT articles.*, 
       COALESCE(COUNT(comments.article_id), 0) AS comment_count 
       FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id;`;
  const queryValues = [articleId];

  const checkArticleExists = checkExists("articles", "article_id", articleId);
  const deleteArticle = db.query(queryStr, queryValues);

  return Promise.all([checkArticleExists, deleteArticle]).then((result) => {
    const article = result[1].rows[0];
    return article;
  });
};

exports.selectAllArticles = (sortBy, order, topic, limit, page) => {
  const promsArray = [];

  let baseQuery = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COALESCE(COUNT(comments.article_id), 0):: INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    baseQuery += ` WHERE articles.topic = $${queryParams.length + 1} `;
    queryParams.push(topic);
    promsArray.push(checkExists("topics", "slug", topic));
  }

  const offset = (page - 1) * limit;
  queryParams.push(limit, offset);

  baseQuery += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order} LIMIT $${
    queryParams.length - 1
  } OFFSET $${queryParams.length}`;
  console.log(baseQuery);
  promsArray.push(checkValidColumns("articles", sortBy));
  promsArray.push(db.query(baseQuery, queryParams));

  return Promise.all(promsArray).then(
    ([promResultOne, promResultTwo, promResultThree]) => {
      const totalQuery = `
      SELECT COUNT(*) AS total_count
      FROM articles
      ${topic ? `WHERE articles.topic = $1` : ""}`;

      return db.query(totalQuery, topic ? [topic] : []).then((countResult) => {
        const total_count = parseInt(countResult.rows[0].total_count, 10);
        return {
          articles: promResultTwo ? promResultTwo.rows : promResultThree.rows,
          total_count,
        };
      });
    }
  );
};

exports.updateArticleVotes = (articleId, votes) => {
  let queryStr = `UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *`;
  const queryValues = [votes, articleId];

  const checkArticleExists = checkExists("articles", "article_id", articleId);
  const updateVotes = db.query(queryStr, queryValues);

  return Promise.all([checkArticleExists, updateVotes]).then((result) => {
    const comment = result[1].rows[0];
    return comment;
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
      return article;
    });
};

exports.removeArticle = (articleId) => {
  let queryStr = `DELETE FROM articles WHERE article_id=$1 RETURNING *`;
  const queryValues = [articleId];

  const deleteArticle = db.query(queryStr, queryValues);

  return Promise.all([deleteArticle]).then((result) => {
    if (result[0].rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Page not found" });
    }
    return;
  });
};
