const { selectApis } = require("../models/api-model");

exports.getApis = (req, res, next) => {
  selectApis()
    .then((apis) => {
      res.status(200).send({ apis });
    })
    .catch((err) => {
      next(err);
    });
};
