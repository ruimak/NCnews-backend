const express = require("express");
const articlesRouter = express.Router();

articlesRouter.route("/").get();

module.exports = articlesRouter;
