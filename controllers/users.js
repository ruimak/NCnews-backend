const { User } = require("../models");

const getUserInfo = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then(userInfo => {
      if (!userInfo) {
        return Promise.reject({
          status: 404,
          msg: "Invalid params: There is no user with that nickname."
        });
      } else res.status(200).send({ userInfo });
    })
    .catch(next);
};

module.exports = { getUserInfo };
