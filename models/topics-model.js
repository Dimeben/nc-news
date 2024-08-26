const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.createTopic = (slug, description) => {
  return db
    .query(
      `
        INSERT INTO topics (slug, description)
        VALUES ($1, $2)
        RETURNING *;
      `,
      [slug, description]
    )
    .then((result) => {
      const topic = result.rows[0];
      return topic;
    });
};
