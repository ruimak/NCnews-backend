const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topics");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "API homepage" });
});

apiRouter.use("/topics", topicsRouter);
// apiRouter.use("/articles", articlesRouter);
// apiRouter.use("/comments", commentsRouter);
// apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
