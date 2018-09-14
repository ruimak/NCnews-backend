const express = require("express");
const apiRouter = express.Router();
const {
  topicsRouter,
  articlesRouter,
  commentsRouter,
  usersRouter
} = require("./");

//homepage
apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "API homepage" });
});

//routes for topics, articles, comments and users
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

//invalid route
apiRouter.use("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

module.exports = apiRouter;
