const { Article, Comments } = require('../models');
const { addCommentCount } = require('../utils');

const getArticles = (req, res, next) => {
  Article.find()
    .lean()
    .populate('created_by', '-_id')
    .then(articles => {
      return Promise.all(
        articles.map(article => {
          return addCommentCount(Comments, article._id, article);
        })
      );
    })
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  Article.findById(req.params.article_id)
    .lean()
    .populate('created_by', '-_id')
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: 'Invalid params: Article not found.'
        });
      } else {
        return addCommentCount(Comments, req.params.article_id, article);
      }
    })
    .then(articleWithCommentCount => {
      res.status(200).send({ articleWithCommentCount });
    })
    .catch(next);
};

const getCommentsForArtId = (req, res, next) => {
  Comments.find({ belongs_to: req.params.article_id })
    .populate('created_by', '-_id name')
    .populate('belongs_to', '-_id title')
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comments not found' });
      } else res.status(200).send({ comments });
    })
    .catch(next);
};

const postCommentforArticleId = (req, res, next) => {
  let belongs_to = req.params.article_id;

  Article.findOne({ _id: belongs_to })
    .populate('created_by', '-_id name')
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: 'Article not found'
        });
      } else {
        return Comments.create({ ...req.body, belongs_to }).then(comment => {
          res.status(201).send({ comment });
        });
      }
    })
    .catch(next);
};

const IncOrDecArtVotes = (req, res, next) => {
  Article.findByIdAndUpdate(
    req.params.article_id,
    {
      $inc: {
        votes: req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : 0
      }
    },
    { new: true }
  )
    .populate('created_by', '-_id name')
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: 'Invalid params: Article not found.'
        });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsForArtId,
  postCommentforArticleId,
  IncOrDecArtVotes
};
