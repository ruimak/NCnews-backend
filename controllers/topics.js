const { Topic, Article } = require("../models");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      //console.log(res);
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getArticleforTopic = (req, res, next) => {
  //console.log(req.params);
  Article.find({ belongs_to: req.params.topic_slug })
    .then(articles => {
      //console.log(articles);
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else res.status(200).send({ articles });
    })
    .catch(next);
};

const postArticleforTopic = (req, res, next) => {
  // console.log(req.body);
  let belongs_to = req.params.topic_slug;
  //console.log(belongs_to);
  // Article.find({ belongs_to: req.params.topic_slug });
  // console.log(belongs_to);
  return Topic.findOne({ slug: belongs_to })
    .then(matchingArticle => {
      if (!matchingArticle) {
        // console.log(matchingArticle);
        return Promise.reject({
          status: 404,
          msg: "Invalid params: Topic not found."
        });
      } else {
        return Article.create({ ...req.body, belongs_to }).then(article => {
          // console.log(article);
          res.status(201).send({ article });
        });
      }
    })
    .catch(err => {
      //console.log(err);
      if (err.msg === "Invalid params: Topic not found.") {
        next(err);
      } else if (err.errors.body.name === "ValidatorError") {
        next({ status: 400, msg: "Bad params, Article body not valid." });
      } else next(err);
    });
};

module.exports = { getTopics, getArticleforTopic, postArticleforTopic };
