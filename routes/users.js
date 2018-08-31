const express = require("express");
const usersRouter = express.Router();
const { getUserInfo } = require("../controllers/users");

usersRouter.route("/:username").get(getUserInfo);

module.exports = usersRouter;
