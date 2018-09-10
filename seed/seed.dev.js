const seedDB = require("./seed");
const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/nc_news";
const {
  articleData,
  commentsData,
  topicsData,
  usersData
} = require("../devData");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    return seedDB(articleData, commentsData, topicsData, usersData);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(next);
