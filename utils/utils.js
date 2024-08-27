const db = require("../db/connection");
const format = require("pg-format");

exports.checkExists = (table_name, column_name, value) => {
  const queryStr = format(
    `SELECT * FROM %I WHERE %I = $1`,
    table_name,
    column_name
  );
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Page not found" });
    }
  });
};
