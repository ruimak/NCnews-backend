const express = require("express");
const articlesRouter = express.Router();
const {
  getArticles,
  getArticleById,
  getCommentsForArtId,
  postCommentforArticleId,
  IncOrDecArtVotes
} = require("../controllers/articles");

articlesRouter.route("/").get(getArticles);
articlesRouter.route("/:article_id").get(getArticleById);
articlesRouter.route("/:article_id/comments").get(getCommentsForArtId);
articlesRouter.route("/:article_id/comments").post(postCommentforArticleId);
articlesRouter.route("/:article_id").patch(IncOrDecArtVotes);
module.exports = articlesRouter;
