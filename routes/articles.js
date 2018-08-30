const express = require("express");
const articlesRouter = express.Router();
const { getArticles, getArticleById } = require("../controllers/articles");

articlesRouter.route("/").get(getArticles);
articlesRouter.route("/:article_id").get(getArticleById);

module.exports = articlesRouter;
