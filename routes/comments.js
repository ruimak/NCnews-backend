const express = require("express");
const commentsRouter = express.Router();
const {
  removeCommentById,
  IncOrDecCommentVote
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .delete(removeCommentById)
  .patch(IncOrDecCommentVote);

module.exports = commentsRouter;
