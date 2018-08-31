const { User } = require("../models");

const getUserInfo = (req, res, next) => {
  //console.log(req.params.article_id);
  User.findOne({ username: req.params.username })
    .then(userInfo => {
      //console.log(article);
      if (!userInfo) {
        // console.log(matchingArticle);
        return Promise.reject({
          status: 404,
          msg: "Invalid params: There is no user with that nickname."
        });
      } else res.status(200).send({ userInfo });
    })
    .catch(next);
};

module.exports = { getUserInfo };
