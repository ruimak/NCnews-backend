const mongoose = require("mongoose");
const { User, Article, Comments, Topic } = require("../models");
const { formatArticleData, formatCommentData } = require("../utils");

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
      let formattedArticleDocs = formatArticleData(
        articleData,
        topicsData,
        userDocs
      );
      return Promise.all([
        userDocs,
        topicDocs,
        Article.insertMany(formattedArticleDocs)
      ]);
    })
    .then(([userDocs, topicDocs, articleDocs]) => {
      let formattedCommentData = formatCommentData(
        commentData,
        userDocs,
        articleDocs
      );
      return Promise.all([
        articleDocs,
        Comments.insertMany(formattedCommentData),
        topicDocs,
        userDocs
      ]);
    })
    .catch(next);
};

module.exports = seedDB;
