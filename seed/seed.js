const mongoose = require("mongoose");
const { User, Article, Comments, Topic } = require("../models");
const { formatArticleData, formatCommentData } = require("../utils");

//This is the seed function
const seedDB = (articleData, commentData, topicsData, usersData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        User.insertMany(usersData),
        Topic.insertMany(topicsData)
      ]);
    })
    .then(([userDocs, topicDocs]) => {
      return Promise.all([
        userDocs,
        topicDocs,
        Article.insertMany(formatArticleData(articleData, topicsData, userDocs))
      ]);
    })
    .then(([userDocs, topicDocs, articleDocs]) => {
      return Promise.all([
        articleDocs,
        Comments.insertMany(
          formatCommentData(commentData, userDocs, articleDocs)
        ),
        topicDocs,
        userDocs
      ]);
    })
    .catch(console.log);
};

module.exports = seedDB;
