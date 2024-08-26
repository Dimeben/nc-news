const db = require("../db/connection");
const { fs, promises } = require("fs");

exports.getApis = (req, res, next) => {
  selectApis()
    .then((apis) => {
      res.status(200).send({ apis });
    })
    .catch((err) => {
      next(err);
    });
};

const selectApis = () => {
  return promises.readFile("./endpoints.json").then((endpoints) => {
    return JSON.parse(endpoints);
  });
};
