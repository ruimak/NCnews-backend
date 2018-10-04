const { Topic, Article, Comments } = require('../models');
const { addCommentCount } = require('../utils');

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getArticleforTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug })
    .populate('created_by', '-_id name')
    .lean()
    .then(articles => {
      return Promise.all(
        articles.map(article => {
          return addCommentCount(Comments, article._id, article);
        })
      );
    })
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: 'not found' });
      } else {
        res.status(200).send({ articles });
      }
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
          msg: 'Invalid params: Topic not found.'
        });
      } else {
        return Article.create({ ...req.body, belongs_to })
          .then(createdArticle => {
            return addCommentCount(
              Comments,
              createdArticle._id,
              createdArticle
            );
          })
          .then(article => {
            res.status(200).send({ article });
          });
      }
    })
    .catch(next);
};

module.exports = { getTopics, getArticleforTopic, postArticleforTopic };
