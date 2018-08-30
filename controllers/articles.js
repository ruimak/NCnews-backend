const { Article } = require("../models");

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
    .catch(next);
};

module.exports = { getArticles, getArticleById };
