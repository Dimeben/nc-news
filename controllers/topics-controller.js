const { selectTopics, createTopic } = require("../models/topics-model");

const isValidString = (value) =>
  typeof value === "string" && value.trim().length > 0;

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  if (!isValidString(slug) || !isValidString(description)) {
    return next({ status: 400, msg: "Bad request" });
  }
  createTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
