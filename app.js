const mongoose = require("mongoose");
const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("./config");
const {
  handleInvalidParams,
  handleInvalidBodies,
  handle500s,
  handle404s
} = require("./errors");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log(`connected to ${DB_URL}`);
  });

app.use(bodyParser.json());
app.use("/api", apiRouter);

//invalid route
app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

//error handling
app.use(handle404s);
app.use(handleInvalidParams);
app.use(handleInvalidBodies);
app.use(handle500s);

module.exports = app;
