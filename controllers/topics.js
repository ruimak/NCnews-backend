const { Topic, Article } = require("../models");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getArticleforTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug })
    .populate("created_by", "-_id name")
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else res.status(200).send({ articles });
    })
    .catch(next);
};

const postArticleforTopic = (req, res, next) => {
  let belongs_to = req.params.topic_slug;

  return Topic.findOne({ slug: belongs_to })
    .then(matchingArticle => {
      if (!matchingArticle) {
        return Promise.reject({
          status: 404,
          msg: "Invalid params: Topic not found."
        });
      } else {
        return Article.create({ ...req.body, belongs_to }).then(article => {
          res.status(201).send({ article });
        });
      }
    })
    .catch(next);
};

module.exports = { getTopics, getArticleforTopic, postArticleforTopic };
