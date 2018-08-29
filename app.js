//const express = require("express");
const mongoose = require("mongoose");
const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const DB_URL = "mongodb://localhost:27017/nc_news";

mongoose.connect(
  DB_URL,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: err.message });
});

module.exports = app;
