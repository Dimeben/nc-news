const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

exports.selectUsername = (username) => {
  let queryStr = `SELECT * FROM users WHERE users.username=$1`;
  const queryValues = [username];

  const checkUserExists = checkExists("users", "username", username);
  const getUsers = db.query(queryStr, queryValues);

  return Promise.all([checkUserExists, getUsers]).then((result) => {
    const user = result[1].rows[0];
    return user;
  });
};