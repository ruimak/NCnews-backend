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
  beforeEach(() => {
    return seedDB(articleData, commentsData, topicsData, usersData).then(
      docs => {
        articleTestData = docs[0];
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
    it("GET returns 404 when given a valid ID that doesnt exist", () => {
      return request
        .get(`/api/articles/${articleTestData[0]._id}`)
        .expect(404)
        .then(res => {
          //console.log(res.body.articles);
          //expect(res.body.articles.length).to.equal(2);
          expect(res.body.msg).to.equal("not found");
        });
    });
  });
});
