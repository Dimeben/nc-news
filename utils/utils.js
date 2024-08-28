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

exports.checkValidColumns = (table_name, column_name) => {
  const columnQueryStr = format(
    `SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = '%I'
      AND column_name = '%I';`,
    table_name,
    column_name
  );

  return db.query(columnQueryStr).then((result) => {
    const validColumns = result.rows.map((row) => row.column_name);
    if (!validColumns.includes(column_name)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  });
};
