const { Topic, Article } = require("../models");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      //console.log(res);
      res.status(200).send({ topics });
    })
    .catch(console.log);
};

const getArticleforTopic = (req, res, next) => {
  console.log(req.params);
  Article.find({ belongs_to: req.params.topic_slug })
    .then(articles => {
      //console.log(articles);
      res.status(200).send({ articles });
    })
    .catch(console.log);
};

const postArticleforTopic = (req, res, next) => {
  console.log(req.body);
let belongs_to = 
  return new Article({...
    req.body
  })
    .save()
    .then(newUser => {
      //console.log(newUser);
      res.status(201).send({ newUser });
    })
    .catch(console.log);
};

module.exports = { getTopics, getArticleforTopic, postArticleforTopic };
