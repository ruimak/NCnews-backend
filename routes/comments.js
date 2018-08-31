const express = require("express");
const commentsRouter = express.Router();
const { removeComment } = require("../controllers/comments");

commentsRouter.route("/:comment_id").delete(removeComment);

module.exports = commentsRouter;
