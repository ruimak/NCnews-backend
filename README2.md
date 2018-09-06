##Project Title

Northcoders News

##Getting Started

In order to run this app localy, you should first clone it into your computer.
Because there are some dependencies used by this project, running the following command is required in order to update the package.json file.

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
##Running in dev mode

```http
DB_URL: "mongodb://localhost:27017/nc_news",
PORT: 9090
```

##Running in test mode

```http
DB_URL: "mongodb://localhost:27017/nc_news_test"
```

##Running the test
In order to run the tests, use the following script:

```http
#Testing script
npm run test
```

The tests used in this project can be split into functionality and error handling tests.
The functionality tests all expect a specific status depending on the methor (eg.: 201 for POST, 200 for GET), and also compare the expected outcome of the function with his actual return,

```http
#Test example:
test example
```

In the error handling tests there was a comparison between the resulting status/message and the status/message for the error being tested

```http
#Test example:
test example
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
