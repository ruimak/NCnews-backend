const { Comments } = require("../models");

const removeCommentById = (req, res, next) => {
  Comments.findByIdAndRemove(req.params.comment_id)
    .populate("created_by", "-_id name")
    .populate("belongs_to", "-_id title")
    .then(comment => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found"
        });
      } else {
        res.status(200).send({ comment });
      }
    })
    .catch(next);
};

const IncOrDecCommentVote = (req, res, next) => {
  Comments.findByIdAndUpdate(
    req.params.comment_id,
    {
      $inc: {
        votes: req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : 0
      }
    },
    { new: true }
  )
    .populate("created_by", "-_id name")
    .populate("belongs_to", "-_id title")
    .then(comment => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Invalid params: Comment not found."
        });
      } else {
        res.status(200).send({ comment });
      }
    })
    .catch(next);
};

module.exports = {
  removeCommentById,
  IncOrDecCommentVote
};
