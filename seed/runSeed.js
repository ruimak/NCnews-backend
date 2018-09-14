const seedDB = require("./seed");
const mongoose = require("mongoose");
const { DB_URL } = require("../config");

const {
  articleData,
  commentsData,
  topicsData,
  usersData
} = require("./devData");

//connecting to the DB, seeding the devData and disconnecting
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
  .catch(console.log);
