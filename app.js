//const express = require("express");
const mongoose = require("mongoose");
const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const { DB_URL } = require("./config/config"); //"mongodb://localhost:27017/nc_news";

mongoose.connect(
  DB_URL,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());
app.use("/api", apiRouter);

// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(res.status).send({ message: err.message });
// });
app.use(({ msg, status }, req, res, next) => {
  if (status) res.status(status).send({ status, msg });
  else res.status(500).send({ msg: "Internal server error.", status: 500 });
});

module.exports = app;
