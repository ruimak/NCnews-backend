const { Comments } = require("../models");

const removeComment = (req, res, next) => {
  Comments.findById(req.params.comment_id)
    .then(comment => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found"
        });
      } else {
        return Promise.all([
          Comments.remove({ _id: req.params.comment_id }),
          comment
        ]);
      }
    })
    .then(([removed, comment]) => {
      return Promise.all([Comments.findById(req.params.comment_id), comment]);
    })
    .then(([isThereComment, comment]) => {
      res.status(201).send({ comment });
    })

    //   Comments.remove({ id: req.params.comment_id })
    //     .then(() => {
    //       res
    //         .status(200)
    //         .send({
    //           msg: `Successfully deleted the comment with the id: ${
    //             req.params.comment_id
    //           }`
    //         });
    //     })
    .catch(err => {
      //  console.log(err);
      if (err.name === "CastError") {
        next({ status: 400, msg: "Bad request, invalid Mongo ID." });
      } else next(err);
    });
};

module.exports = {
  removeComment
};
