const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const usersRouter = require("./users");

//homepage
apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "API homepage" });
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

//invalid route
apiRouter.use("/*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = apiRouter;
