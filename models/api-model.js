const db = require("../db/connection");
const { fs, promises } = require("fs");

exports.selectApis = () => {
  return promises
    .readFile("./endpoints.json", "utf-8")
    .then((endpoints) => {
      return JSON.parse(endpoints);
    })
    .catch((err) => {
      next(err);
    });
};
