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
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(IncOrDecArtVotes);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArtId)
  .post(postCommentforArticleId);

module.exports = articlesRouter;
