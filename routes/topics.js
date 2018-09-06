const express = require("express");
const topicsRouter = express.Router();
const {
  getTopics,
  getArticleforTopic,
  postArticleforTopic
} = require("../controllers/topics");

topicsRouter.route("/").get(getTopics);
topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticleforTopic)
  .post(postArticleforTopic);

module.exports = topicsRouter;
