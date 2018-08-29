const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const { articleData, commentsData, topicsData, usersData } =
  // process.env.NODE_ENV === "production"
  //   ? require("../devData")
  /*:*/ require("../seed/testData");

describe("Connecting to and clearing the DB after each test, then at the end disconnecting", () => {
  let userDocs;
  beforeEach(() => {
    return seedDB(articleData, commentsData, topicsData, usersData).then(
      docs => {
        userDocs = docs[0];
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
    it("get method returns status 200 and the proper data", () => {
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
    it("get method returns status 200 and the proper data (for cats as the params, length is 2 and the 1st ones body is 'Well? Think about it.'", () => {
      return request
        .get("/api/topics/cats/articles")
        .expect(200)
        .then(res => {
          //console.log(res.body.articles);
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].body).to.equal("Well? Think about it.");
        });
    });
  });
});
