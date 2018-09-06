const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const {
  articleData,
  commentsData,
  topicsData,
  usersData
} = require("../seed/testData");
process.env.NODE_ENV = "test";

describe("Connecting to and clearing the DB after each test, then at the end disconnecting", () => {
  let articleTestDocs, commentsTestDocs, usersTestDocs, topicsTestDocs;
  beforeEach(() => {
    return seedDB(articleData, commentsData, topicsData, usersData).then(
      docs => {
        [
          articleTestDocs,
          commentsTestDocs,
          topicsTestDocs,
          usersTestDocs
        ] = docs;
      }
    );
  });
  after(() => {
    mongoose.disconnect();
  });

  describe("/api", () => {
    it("GET returns 200 and expected message", () => {
      return request
        .get("/api/")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({ msg: "API homepage" });
        });
    });
  });
  describe("/api/topics", () => {
    it("GET method returns status 200 and the proper data", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[1].title).to.equal("Cats");
        });
    });
  });
  describe("/api/topics/:topic_slug/articles", () => {
    it("GET method returns status 200 and the proper data (for cats as the params, length is 2 and the 1st ones body is 'Well? Think about it.'", () => {
      return request
        .get("/api/topics/cats/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].body).to.equal("Well? Think about it.");
        });
    });
    it("GET returns 404 when given an invalid id", () => {
      return request
        .get("/api/topics/nonexistent_topic/articles")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("not found");
        });
    });
  });
  describe("/api/topics/:topic_slug/articles", () => {
    it("POST method creates a new entry, with the proper body in it", () => {
      return request
        .post("/api/topics/cats/articles")
        .send({
          title: "new article",
          votes: 0,
          body: "This is my new article content",
          created_by: `${articleTestDocs[0]._id}`
        })
        .expect(201)
        .then(res => {
          expect(Object.keys(res.body.article).length).to.equal(8);
          expect(res.body.article.title).to.eql("new article");
        });
    });
    it("POST method sends 404 when cant find the params in the topic data", () => {
      return request
        .post("/api/topics/nonexistent_topic/articles")
        .send({
          title: "new article",
          votes: 0,
          body: "This is my new article content",
          created_by: `${articleTestDocs[0]._id}`
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid params: Topic not found.");
        });
    });
    it("POST method sends 400 when body is not valid", () => {
      return request
        .post("/api/topics/cats/articles")
        .send({
          title: "new article",
          votes: 0,
          created_by: `${articleTestDocs[0]._id}`
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request, body isnt valid");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET method returns status 200 and the proper data", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articlesWithCommentCount.length).to.equal(4);
          expect(res.body.articlesWithCommentCount[0]).to.have.all.keys(
            "_id",
            "votes",
            "title",
            "created_by",
            "body",
            "created_at",
            "belongs_to",
            "__v",
            "comment_count"
          );
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET method returns status 200 and the proper data for an article by ID, has 9 keys and one param should match the expected'", () => {
      return request
        .get(`/api/articles/${articleTestDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article.title).to.equal(articleTestDocs[0].title);
          expect(res.body.articleWithCommentCount).to.have.all.keys(
            "_id",
            "votes",
            "title",
            "created_by",
            "body",
            "created_at",
            "belongs_to",
            "__v",
            "comment_count"
          );
        });
    });
    it("GET returns 400 when searching for an invalid mongo ID", () => {
      return request
        .get(`/api/articles/nonexistent_path`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("GET returns 404 when searching for a valid mongo ID that doesnt exist in the collection", () => {
      return request
        .get(`/api/articles/5b8907a88c973b386d4b20af`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid params: Article not found.");
        });
    });
  });

  describe("/api/articles/:article_id?vote=up", () => {
    it("PATCH method returns status 200 and an updated article, votes up", () => {
      return request
        .patch(`/api/articles/${articleTestDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(articleTestDocs[0].votes + 1);
        });
    });
    it("PATCH returns 400 when searching for an invalid mongo ID, vote up", () => {
      return request
        .patch(`/api/articles/nonexistent_path?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH returns 404 when searching for an valid id but there is no such article, vote up", () => {
      return request
        .patch(`/api/articles/5b8907a88c973b386d4b20af?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid params: Article not found.");
        });
    });
    it("PATCH method returns status 200 and an updated article, votes down", () => {
      return request
        .patch(`/api/articles/${articleTestDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(articleTestDocs[0].votes - 1);
        });
    });
    it("PATCH returns 400 when searching for an invalid mongo ID, vote down", () => {
      return request
        .patch(`/api/articles/nonexistent_path?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH returns 404 when searching for an valid id but there is no such article, vote down", () => {
      return request
        .patch(`/api/articles/5b8907a88c973b386d4b20af?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid params: Article not found.");
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    it("GET returns status 200 and all the comments for an article by ID (2 total), and the 1st comment should have 7 keys and the expected body", () => {
      return request
        .get(`/api/articles/${articleTestDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments[0].body).to.equal(commentsTestDocs[0].body);
          expect(Object.keys(res.body.comments[0]).length).to.equal(7);
          expect(res.body.comments.length).to.equal(2);
        });
    });
    it("GET returns 400 when searching for an invalid mongo ID", () => {
      return request
        .get(`/api/articles/nonexistent_path/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("GET returns 404 when searching for a valid mongo ID that doesnt exist in the collection", () => {
      return request
        .get(`/api/articles/5b8907a88c973b386d4b20af/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Comments not found");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("POST method returns 201, and an expected body", () => {
      return request
        .post(`/api/articles/${articleTestDocs[0]._id}/comments`)
        .send({
          body: "Sport Lisboa e Benfica",
          created_by: `${articleTestDocs[0].created_by}`
        })
        .expect(201)
        .then(res => {
          expect(Object.keys(res.body.comment).length).to.equal(7);
          expect(res.body.comment.body).to.eql("Sport Lisboa e Benfica");
        });
    });
    it("POST returns 400 when searching for an invalid mongo ID", () => {
      return request
        .post(`/api/articles/nonexistent_path/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("POST returns 404 when searching for a valid mongo ID that doesnt exist", () => {
      return request
        .post(`/api/articles/5b8907a88c973b386d4b20af/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Comments not found");
        });
    });
    it("POST method sends 400 when body is not valid", () => {
      return request
        .post(`/api/articles/${articleTestDocs[0]._id}/comments`)
        .send({
          body: "Sport Lisboa e Benfica"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request, body isnt valid");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("DELETE should get rid of a comment, send back status 201 and the deleted content", () => {
      return request
        .delete(`/api/comments/${commentsTestDocs[0]._id}`)
        .expect(201)
        .then(res => {
          expect(res.body.comment.body).to.equal(commentsTestDocs[0].body);
        });
    });
    it("GET returns 400 when searching for an invalid mongo ID", () => {
      return request
        .delete("/api/comments/nonexistent_path")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("GET returns 404 when searching a valid mongo ID that isnt in the collection", () => {
      return request
        .delete("/api/comments/5b8907a88c973b386d4b20af")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Comment not found");
        });
    });
  });

  describe("/api/articles/:comment_id?vote=up", () => {
    it("PATCH method returns status 200 and an updated comment, vote up", () => {
      return request
        .patch(`/api/comments/${commentsTestDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(
            commentsTestDocs[0].votes + 1
          );
        });
    });
    it("PATCH returns 400 when searching for an invalid mongo ID, vote up", () => {
      return request
        .patch(`/api/comments/nonexistent_path?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH returns 404 when searching for an valid id but there is no such article, vote up", () => {
      return request
        .patch(`/api/comments/5b8907a88c973b386d4b20af?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid params: Comment not found.");
        });
    });
    it("PATCH method returns status 200 and an updated comment, votes down", () => {
      return request
        .patch(`/api/comments/${commentsTestDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(
            commentsTestDocs[0].votes - 1
          );
        });
    });
    it("PATCH returns 400 when searching for an invalid mongo ID, vote down", () => {
      return request
        .patch(`/api/comments/nonexistent_path?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH returns 404 when searching for an valid id but there is no such article, vote down", () => {
      return request
        .patch(`/api/comments/5b8907a88c973b386d4b20af?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid params: Comment not found.");
        });
    });
  });

  describe("/api/users/:username", () => {
    it("GET method returns status 200 and the proper data, length is 2 and the 1st ones body is 'Well? Think about it.'", () => {
      return request
        .get(`/api/users/${usersTestDocs[0].username}`)
        .expect(200)
        .then(res => {
          expect(Object.keys(res.body.userInfo).length).to.equal(5);
          expect(res.body.userInfo.name).to.equal(usersTestDocs[0].name);
        });
    });
    it("GET returns 404 when given an invalid id", () => {
      return request
        .get("/api/users/nonexistent_user")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(
            "Invalid params: There is no user with that nickname."
          );
        });
    });
  });
});
