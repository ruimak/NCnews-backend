##Project Title

Northcoders News

##Getting Started

To prepare your system for running the app locally, run this command in your local directory to install the dependencies:

```http
"npm install"
```

##Prerequisites

Node.js
MongoDB

##Dependencies
body-parser
express
mongoose

##devDependencies
chai
mocha
nodemon
supertest

##Configurations

You need to create a config folder with an index.js file inside, and that file should have the following object in it to be able to run the app either in dev or test modes:

```http
const ENV = process.env.NODE_ENV || "development";

const config = {
  development: {
    DB_URL: "mongodb://localhost:27017/nc_news",
    PORT: 9090
  },
  test: {
    DB_URL: "mongodb://localhost:27017/nc_news_test"
  }
};

module.exports = config[ENV];
```

##Mongo Database

In order to make requests and manage MongoDB data (and therefore run tests/ run app in dev) you need to run the following command in a terminal:

```http
#Running Mongod
mongod
```

##Running the tests

In order to run the tests, use the following script:

```http
#Testing script
npm run test
```

The tests used in this project can be split into functionality and error handling tests.
The functionality tests all expect a specific status depending on the methor (eg.: 201 for POST, 200 for GET), and also compare the expected outcome of the function with his actual return,

```http
#Test example:
This particular test checks if calling the GET method on endpoint /api/articles/:article_id returns a 200 status, and an article with every key and values associated with the keys (in this particular example the title was tested for its content).

describe("/api/articles/:article_id", () => {
 it("GET method returns status 200 and the proper data for an article by ID, has all 9 keys and one key value should match the expected'", () => {
      return request
        .get(`/api/articles/${articleTestDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.articleWithCommentCount.title).to.equal(
            articleTestDocs[0].title
          );
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
}
```

In the error handling tests there was a comparison between the resulting status/message and the status/message for the error being tested

```http
#Test example:
In this particular test we called the GET method on the /api/articles/nonexistent_path path, and expect the return to be a 400 status and the message "Bad request", because "nonexistent_path" is not a valid mongoID therefore its rejected as a parameter.

describe("/api/articles/:article_id", () => {
  it("GET returns 400 when searching for an invalid mongo ID", () => {
      return request
        .get(`/api/articles/nonexistent_path`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad request");
        });
    });
```

##Running in Dev mode

In order to run the app in development mode, use the following script:

```http
#Testing script
npm run dev
```

This will run the listen.js file, and then you can access the app in your browser, at http://localhost:9090/api

##Endpoints

```http
GET /api
# Serves an HTML page with documentation for all the available endpoints
```

```http
GET /api/topics
# Get all the topics
```

```http
GET /api/topics/:topic_slug/articles
# Return all the articles for a certain topic
# e.g: `/api/topics/football/articles`
```

```http
POST /api/topics/:topic_slug/articles
# Add a new article to a topic. This route requires a JSON body with title and body key value pairs
# e.g: `{ "title": "new article", "body": "This is my new article content", "created_by": "user_id goes here"}`
```

```http
GET /api/articles
# Returns all the articles
```

```http
GET /api/articles/:article_id
# Get an individual article
```

```http
GET /api/articles/:article_id/comments
# Get all the comments for a individual article
```

```http
POST /api/articles/:article_id/comments
# Add a new comment to an article. This route requires a JSON body with body and created_by key value pairs
# e.g: `{"body": "This is my new comment", "created_by": "user_id goes here"}`
```

```http
PATCH /api/articles/:article_id
# Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/articles/:article_id?vote=up`
```

```http
PATCH /api/comments/:comment_id
# Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/comments/:comment_id?vote=down`
```

```http
DELETE /api/comments/:comment_id
# Deletes a comment
```

```http
GET /api/users/:username
# e.g: `/api/users/mitch123`
# Returns a JSON object with the profile data for the specified user.
```

#Updates

-A comment count function was added and that property (comment_count) should be in the article object on the "GET /api/articles" or "GET /api/articles/:article_id" endpoints
