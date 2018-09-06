exports.formatArticleData = (articleData, topicsData, userDocs) => {
  return articleData.map(article => {
    let belongs_to = topicsData.find(obj => {
      return obj.slug === article.topic;
    }).slug;
    let created_by = userDocs.find(obj => {
      return obj.username === article.created_by;
    })._id;

    return { ...article, created_by, belongs_to };
  });
};

exports.formatCommentData = (commentData, userDocs, articleDocs) => {
  return commentData.map(comment => {
    let belongs_to = articleDocs.find(obj => {
      return obj.title === comment.belongs_to;
    })._id;
    let created_by = userDocs.find(obj => {
      return obj.username === comment.created_by;
    })._id;

    return { ...comment, created_by, belongs_to };
  });
};

exports.addCommentCount = (commentsDocs, articleId, article) => {
  return commentsDocs
    .find({ belongs_to: articleId })
    .then(comments => {
      // console.log(articleId, "articleID");
      // console.log(comments, "comments");
      article.comment_count = comments.length;
      // console.log(article, "article");
      return article;
    })
    .catch(console.log);
};
