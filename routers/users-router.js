const usersRouter = require("express").Router();
const { getUsers, getUsername } = require("../controllers/users-controller");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUsername);

module.exports = usersRouter;
