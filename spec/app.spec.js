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

describe("Connecting to and clearing the DB after each test, then at the end disconnecting", () => {
  let articleTestData;
  let commentsTestData;
  let usersTestData;
  beforeEach(() => {
    return seedDB(articleData, commentsData, topicsData, usersData).then(
      docs => {
        articleTestData = docs[0];
        commentsTestData = docs[1];
        usersTestData = docs[3];
      }
    );
  });
  after(() => {
    mongoose.disconnect();
  });
  describe("", () => {
    describe("/api", () => {
      it("returns 200 and proper message", () => {
        return request
          .get("/api/")
          .expect(200)
          .then(res => {
            // console.log(Object.keys(res));
            // console.log(res.body);
            expect(res.body).to.eql({ msg: "API homepage" });
          });
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
          //console.log(res.body.articles);
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].body).to.equal("Well? Think about it.");
        });
    });
    it("GET returns 404 when given an invalid id", () => {
      return request
        .get("/api/topics/foiawfawhfawifhawpf/articles")
        .expect(404)
        .then(res => {
          //console.log(res.body.articles);
          //expect(res.body.articles.length).to.equal(2);
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
          created_by: `${articleTestData[0]._id}`
        })
        .expect(201)
        .then(res => {
          expect(Object.keys(res.body.article).length).to.equal(8);
          expect(res.body.article.title).to.eql("new article");
        });
    });
    it("POST method sends 404 when cant find the params in the topic data", () => {
      return request
        .post("/api/topics/caafwawfawfs/articles")
        .send({
          title: "new article",
          votes: 0,
          body: "This is my new article content",
          created_by: `${articleTestData[0]._id}`
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
          created_by: `${articleTestData[0]._id}`
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad params, Article body not valid.");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET method returns status 200 and the proper data", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[1].title).to.equal(
            "7 inspirational thought leaders from Manchester UK"
          );
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET method returns status 200 and the proper data for an article by ID, has 9 keys and one param should match the expected'", () => {
      return request
        .get(`/api/articles/${articleTestData[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article.title).to.equal(articleTestData[0].title);
          expect(Object.keys(res.body.article).length).to.equal(8);
        });
    });
    it("GET returns 400 when searching for an invalid mongo ID", () => {
      return request
        .get(`/api/articles/o_sporting_e_uma_boa_equipa`)
        .expect(400)
        .then(res => {
          //console.log(res.body.articles);
          //expect(res.body.articles.length).to.equal(2);
          expect(res.body.msg).to.equal("Bad request, invalid Mongo ID.");
        });
    });
    it("GET returns 404 when searching for an invalid mongo ID", () => {
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
        .patch(`/api/articles/${articleTestData[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(articleTestData[0].votes + 1);
        });
    });
    it("PATCH returns 400 when searching for an invalid mongo ID, vote up", () => {
      return request
        .patch(`/api/articles/o_sporting_e_uma_boa_equipa?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request, invalid Mongo ID.");
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
        .patch(`/api/articles/${articleTestData[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(articleTestData[0].votes - 1);
        });
    });
    it("PATCH returns 400 when searching for an invalid mongo ID, vote down", () => {
      return request
        .patch(`/api/articles/o_sporting_e_uma_boa_equipa?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request, invalid Mongo ID.");
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
    it("GET method returns status 200 and all the comments for an article by ID (2 total), and the comment should have 7 keys and the proper body in it", () => {
      return request
        .get(`/api/articles/${articleTestData[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments[0].body).to.equal(commentsTestData[0].body);
          expect(Object.keys(res.body.comments[0]).length).to.equal(7);
          expect(res.body.comments.length).to.equal(2);
        });
    });
    it("GET returns 400 when searching for an invalid mongo ID", () => {
      return request
        .get(`/api/articles/o_sporting_e_uma_boa_equipa/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request, invalid Mongo ID.");
        });
    });
    it("GET returns 404 when searching for an invalid mongo ID", () => {
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
        .post(`/api/articles/${articleTestData[0]._id}/comments`)
        .send({
          body: "Sport Lisboa e Benfica",
          created_by: `${articleTestData[0].created_by}`
        })
        .expect(201)
        .then(res => {
          expect(Object.keys(res.body.comment).length).to.equal(7);
          expect(res.body.comment.body).to.eql("Sport Lisboa e Benfica");
        });
    });
    it("POST returns 400 when searching for an invalid mongo ID", () => {
      return request
        .post(`/api/articles/o_sporting_e_uma_boa_equipa/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request, invalid Mongo ID.");
        });
    });
    it("POST returns 404 when searching for an invalid mongo ID", () => {
      return request
        .post(`/api/articles/5b8907a88c973b386d4b20af/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Comments not found");
        });
    });
    it("POST method sends 400 when body is not valid", () => {
      return request
        .post(`/api/articles/${articleTestData[0]._id}/comments`)
        .send({
          body: "Sport Lisboa e Benfica"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad params, Comment body not valid.");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("DELETE should get rid of a comment, send back status 201 and the deleted content", () => {
      return request
        .delete(`/api/comments/${commentsTestData[0]._id}`)
        .expect(201)
        .then(res => {
          expect(res.body.comment.body).to.equal(commentsTestData[0].body);
        });
    });
    it("GET returns 400 when searching for an invalid mongo ID", () => {
      return request
        .delete("/api/comments/o_sporting_e_uma_boa_equipa")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request, invalid Mongo ID.");
        });
    });
    it("GET returns 404 when searching for an invalid mongo ID", () => {
      return request
        .delete("/api/comments/5b8907a88c973b386d4b20af")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Comment not found");
        });
    });
  });
  describe("/api/users/:username", () => {
    it("GET method returns status 200 and the proper data, length is 2 and the 1st ones body is 'Well? Think about it.'", () => {
      console.log(usersTestData[0].username);
      return request
        .get(`/api/users/${usersTestData[0].username}`)
        .expect(200)
        .then(res => {
          expect(Object.keys(res.body.userInfo).length).to.equal(5);
          expect(res.body.userInfo.name).to.equal(usersTestData[0].name);
        });
    });
    it("GET returns 404 when given an invalid id", () => {
      return request
        .get("/api/users/wafawfawfawfawfawgheeaaw")
        .expect(404)
        .then(res => {
          //console.log(res.body.articles);
          //expect(res.body.articles.length).to.equal(2);
          expect(res.body.msg).to.equal(
            "Invalid params: There is no user with that nickname."
          );
        });
    });
  });
});
