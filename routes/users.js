const express = require("express");
const usersRouter = express.Router();

usersRouter.route("/").get();

module.exports = usersRouter;
