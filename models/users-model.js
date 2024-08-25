const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

exports.selectUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE users.username=$1`, [username])
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return user.rows[0];
    });
};
