const { Article, Comments } = require("../models");

const getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      //console.log(res);
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  //console.log(req.params.article_id);
  Article.findById(req.params.article_id)
    .then(article => {
      //console.log(article);
      if (!article) {
        // console.log(matchingArticle);
        return Promise.reject({
          status: 404,
          msg: "Invalid params: Article not found."
        });
      } else res.status(200).send({ article });
    })
    .catch(err => {
      //console.log(err);
      if (err.name === "CastError") {
        next({ status: 400, msg: "Bad request, invalid Mongo ID." });
      } else next(err);
    });
};

const getCommentsForArtId = (req, res, next) => {
  //console.log(req.params);
  Comments.find({ belongs_to: req.params.article_id })
    .then(comments => {
      //console.log(articles);
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Comments not found" });
      } else res.status(200).send({ comments });
    })
    .catch(err => {
      //console.log(err);
      if (err.name === "CastError") {
        next({ status: 400, msg: "Bad request, invalid Mongo ID." });
      } else next(err);
    });
};

const postCommentforArticleId = (req, res, next) => {
  // console.log(req.body);
  let belongs_to = req.params.article_id;

  Article.findOne({ _id: belongs_to })
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Comments not found"
        });
      } else {
        return Comments.create({ ...req.body, belongs_to }).then(comment => {
          res.status(201).send({ comment });
        });
      }
    })
    .catch(err => {
      if (err.msg === "Invalid params: Article not found.") {
        next(err);
      } else if (err.name === "CastError") {
        next({
          status: 400,
          msg: "Bad request, invalid Mongo ID."
        });
      } else if (
        err.name === "ValidatorError" ||
        err.name === "ValidationError"
      ) {
        next({
          status: 400,
          msg: "Bad params, Comment body not valid."
        });
      } else next(err);
    });
};

const IncOrDecArtVotes = (req, res, next) => {
  // console.log(req.query);
  // if (req.query.vote === "up") {
  //   Article.findOne({ _id: req.params.article_id })
  //     .then(article => {
  //       if (!article) {
  //         return Promise.reject({
  //           status: 404,
  //           msg: "Invalid params: Article not found."
  //         });
  //       } else {
  //         // console.log(article);
  //         article.votes++;
  //         return Article.create(article).then(updatedArticle => {
  //           //  console.log(updatedArticle);
  //           res.status(200).send({ updatedArticle });
  //           //  });
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       // console.log(err);
  //       if (err.name === "CastError") {
  //         next({ status: 400, msg: "Bad request, invalid Mongo ID." });
  //       } else next(err);
  //     });
  // } else if (req.query.vote === "down") {
  //   Article.findOne({ _id: req.params.article_id })
  //     .then(article => {
  //       if (!article) {
  //         return Promise.reject({
  //           status: 404,
  //           msg: "Invalid params: Article not found."
  //         });
  //       } else {
  //         article.votes--;
  //         return Article.create(article).then(updatedArticle => {
  //           res.status(200).send({ updatedArticle });
  //         });
  //       }
  //     })

  if (req.query.vote === "up") {
    // console.log(req.params.article_id);
    // console.log(req.params.article_id);
    Article.findByIdAndUpdate(
      req.params.article_id,
      { $inc: { votes: 1 } },
      { new: true }
    )
      .then(article => {
        // console.log(article);
        if (!article) {
          return Promise.reject({
            status: 404,
            msg: "Invalid params: Article not found."
          });
        } else {
          // console.log(article);
          res.status(200).send({ article });
        }
      })
      .catch(err => {
        // console.log(err);
        if (err.name === "CastError") {
          next({ status: 400, msg: "Bad request, invalid Mongo ID." });
        } else next(err);
      });
  } else if (req.query.vote === "down") {
    Article.findByIdAndUpdate(
      req.params.article_id,
      { $inc: { votes: -1 } },
      { new: true }
    )
      .then(article => {
        if (!article) {
          return Promise.reject({
            status: 404,
            msg: "Invalid params: Article not found."
          });
        } else {
          // console.log(article);
          res.status(200).send({ article });
        }
      })
      .catch(err => {
        // console.log(err);
        if (err.name === "CastError") {
          next({ status: 400, msg: "Bad request, invalid Mongo ID." });
        } else next(err);
      });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsForArtId,
  postCommentforArticleId,
  IncOrDecArtVotes
};
