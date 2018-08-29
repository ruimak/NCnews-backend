const express = require("express");
const commentsRouter = express.Router();

commentsRouter.route("/").get();

module.exports = commentsRouter;
