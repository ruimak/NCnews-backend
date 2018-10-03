process.env.NODE_ENV = 'test';
const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');
const {
  articleData,
  commentsData,
  topicsData,
  usersData
} = require('../seed/testData');

describe('Connecting to and clearing the DB after each test, then at the end disconnecting', () => {
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

  describe('/api', () => {
    it('GET returns 200 and expected message', () => {
      return request
        .get('/api/')
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({ msg: 'API homepage' });
        });
    });
  });
  describe('/nonexistent_endpoint', () => {
    it('GET returns 404 and expected message', () => {
      return request
        .get('/nonexistent_endpoint')
        .expect(404)
        .then(res => {
          expect(res.body).to.eql({ msg: 'Page not found' });
        });
    });
  });
  describe('/api/nonexistent_endpoint', () => {
    it('GET returns 404 and expected message', () => {
      return request
        .get('/api/nonexistent_endpoint')
        .expect(404)
        .then(res => {
          expect(res.body).to.eql({ msg: 'Page not found' });
        });
    });
  });
  describe('/api/topics', () => {
    it('GET method returns status 200, an array with 2 articles, and the articles have all the keys and the right info attached', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics.length).to.equal(2);
          expect(Object.keys(res.body.topics[0]).length).to.equal(4);
          expect(res.body.topics[0]).to.have.all.keys(
            '_id',
            'title',
            'slug',
            '__v'
          );
          expect(res.body.topics[1].title).to.equal(topicsTestDocs[1].title);
        });
    });
  });
  describe('/api/topics/:topic_slug/articles', () => {
    it('GET method returns status 200 and 2 articles, with all the keys with the right information attached to each key', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.have.all.keys(
            'votes',
            '_id',
            'title',
            'created_by',
            'body',
            'created_at',
            'belongs_to',
            '__v'
          );
          expect(res.body.articles.length).to.equal(2);
          const body = articleTestDocs.find(
            article => article._id === res.body.articles[0]._id
          );
          expect(res.body.articles[0].body).to.equal('Well? Think about it.');
        });
    });
    it('GET returns 404 when given an invalid id', () => {
      return request
        .get('/api/topics/nonexistent_topic/articles')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('not found');
        });
    });
  });
  describe('/api/topics/:topic_slug/articles', () => {
    it('POST method creates a new entry, with all the keys and the proper body in it', () => {
      return request
        .post('/api/topics/cats/articles')
        .send({
          title: 'New article',
          votes: 0,
          body: 'This is my new article content',
          created_by: `${articleTestDocs[0]._id}`
        })
        .expect(200)
        .then(res => {
          expect(res.body.article).to.have.all.keys(
            'votes',
            '_id',
            'title',
            'created_by',
            'body',
            'created_at',
            'belongs_to',
            '__v'
          );
          expect(res.body.article.title).to.eql('New article');
          expect(res.body.article.body).to.eql(
            'This is my new article content'
          );
        });
    });
    it('POST method sends 404 when cant find the params in the topic data', () => {
      return request
        .post('/api/topics/nonexistent_topic/articles')
        .send({
          title: 'new article',
          votes: 0,
          body: 'This is my new article content',
          created_by: `${articleTestDocs[0]._id}`
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid params: Topic not found.');
        });
    });
    it('POST method sends 400 when body is not valid', () => {
      return request
        .post('/api/topics/cats/articles')
        .send({
          title: 'new article',
          votes: 0,
          created_by: `${articleTestDocs[0]._id}`
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'articles validation failed: body: Path `body` is required.'
          );
        });
    });
  });
  describe('/api/articles', () => {
    it('GET method returns status 200 and 4 articles with the the proper data', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.have.all.keys(
            '_id',
            'votes',
            'title',
            'created_by',
            'body',
            'created_at',
            'belongs_to',
            '__v',
            'comment_count'
          );
        });
    });
  });
  describe('/api/articles/:article_id', () => {
    it("GET method returns status 200 and the proper data for an article by ID, has all 9 keys and one key value should match the expected'", () => {
      return request
        .get(`/api/articles/${articleTestDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.articleWithCommentCount.title).to.equal(
            articleTestDocs[0].title
          );
          expect(res.body.articleWithCommentCount).to.have.all.keys(
            '_id',
            'votes',
            'title',
            'created_by',
            'body',
            'created_at',
            'belongs_to',
            '__v',
            'comment_count'
          );
        });
    });
    it('GET returns 400 when searching for an invalid mongo ID', () => {
      return request
        .get(`/api/articles/nonexistent_path`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "_id" for model "articles"'
          );
        });
    });
    it('GET returns 404 when searching for a valid mongo ID that doesnt exist in the collection', () => {
      return request
        .get(`/api/articles/5b8907a88c973b386d4b20af`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid params: Article not found.');
        });
    });
  });

  describe('/api/articles/:article_id?vote=up', () => {
    it('PATCH method returns status 200 and an updated article, votes up', () => {
      return request
        .patch(`/api/articles/${articleTestDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article).to.have.all.keys(
            '_id',
            'votes',
            'title',
            'created_by',
            'body',
            'created_at',
            'belongs_to',
            '__v'
          );
          expect(res.body.article.votes).to.equal(articleTestDocs[0].votes + 1);
        });
    });
    it('PATCH returns 400 when searching for an invalid mongo ID, vote up', () => {
      return request
        .patch(`/api/articles/nonexistent_path?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "_id" for model "articles"'
          );
        });
    });
    it('PATCH returns 404 when searching for an valid id but there is no such article, vote up', () => {
      return request
        .patch(`/api/articles/5b8907a88c973b386d4b20af?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid params: Article not found.');
        });
    });
    it('PATCH method returns status 200 and an updated article, votes down', () => {
      return request
        .patch(`/api/articles/${articleTestDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article).to.have.all.keys(
            '_id',
            'votes',
            'title',
            'created_by',
            'body',
            'created_at',
            'belongs_to',
            '__v'
          );
          expect(res.body.article.votes).to.equal(articleTestDocs[0].votes - 1);
        });
    });
    it('PATCH returns 400 when searching for an invalid mongo ID, vote down', () => {
      return request
        .patch(`/api/articles/nonexistent_path?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "_id" for model "articles"'
          );
        });
    });
    it('PATCH returns 404 when searching for an valid id but there is no such article, vote down', () => {
      return request
        .patch(`/api/articles/5b8907a88c973b386d4b20af?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid params: Article not found.');
        });
    });
  });

  describe('/api/articles/:article_id/comments', () => {
    it('GET returns status 200 and all the comments for an article by ID (2 total), and the 1st comment should have all the keys and the expected body', () => {
      return request
        .get(`/api/articles/${articleTestDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments[0]).to.have.all.keys(
            'votes',
            '_id',
            'body',
            'belongs_to',
            'created_by',
            'created_at',
            '__v'
          );
          expect(res.body.comments[0].body).to.equal(commentsTestDocs[0].body);
          expect(res.body.comments.length).to.equal(2);
        });
    });
    it('GET returns 400 when searching for an invalid mongo ID', () => {
      return request
        .get(`/api/articles/nonexistent_path/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "belongs_to" for model "comments"'
          );
        });
    });
    it('GET returns 404 when searching for a valid mongo ID that doesnt exist in the collection', () => {
      return request
        .get(`/api/articles/5b8907a88c973b386d4b20af/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Comments not found');
        });
    });
  });
  describe('/api/articles/:article_id/comments', () => {
    it('POST method returns 201, all the keys and expected body', () => {
      return request
        .post(`/api/articles/${articleTestDocs[0]._id}/comments`)
        .send({
          body: 'Sport Lisboa e Benfica',
          created_by: `${articleTestDocs[0].created_by}`
        })
        .expect(201)
        .then(res => {
          expect(res.body.comment).to.have.all.keys(
            'votes',
            '_id',
            'body',
            'belongs_to',
            'created_by',
            'created_at',
            '__v'
          );
          expect(res.body.comment.body).to.eql('Sport Lisboa e Benfica');
        });
    });
    it('POST returns 400 when searching for an invalid mongo ID', () => {
      return request
        .post(`/api/articles/nonexistent_path/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "_id" for model "articles"'
          );
        });
    });
    it('POST returns 404 when searching for a valid mongo ID that doesnt exist', () => {
      return request
        .post(`/api/articles/5b8907a88c973b386d4b20af/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Article not found');
        });
    });
    it('POST method sends 400 when body is not valid', () => {
      return request
        .post(`/api/articles/${articleTestDocs[0]._id}/comments`)
        .send({
          body: 'Sport Lisboa e Benfica'
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'comments validation failed: created_by: Path `created_by` is required.'
          );
        });
    });
  });
  describe('/api/comments/:comment_id', () => {
    it('DELETE should get rid of a comment, send back status 200 and the deleted content', () => {
      return request
        .delete(`/api/comments/${commentsTestDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.comment).to.have.all.keys(
            'votes',
            '_id',
            'body',
            'belongs_to',
            'created_by',
            'created_at',
            '__v'
          );
          expect(res.body.comment.body).to.equal(commentsTestDocs[0].body);
        });
    });
    it('GET returns 400 when searching for an invalid mongo ID', () => {
      return request
        .delete('/api/comments/nonexistent_path')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "_id" for model "comments"'
          );
        });
    });
    it('GET returns 404 when searching a valid mongo ID that isnt in the collection', () => {
      return request
        .delete('/api/comments/5b8907a88c973b386d4b20af')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Comment not found');
        });
    });
  });

  describe('/api/articles/:comment_id?vote=up', () => {
    it('PATCH method returns status 200 and an updated comment, vote up', () => {
      return request
        .patch(`/api/comments/${commentsTestDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment).to.have.all.keys(
            'votes',
            '_id',
            'body',
            'belongs_to',
            'created_by',
            'created_at',
            '__v'
          );
          expect(res.body.comment.votes).to.equal(
            commentsTestDocs[0].votes + 1
          );
        });
    });
    it('PATCH returns 400 when searching for an invalid mongo ID, vote up', () => {
      return request
        .patch(`/api/comments/nonexistent_path?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "_id" for model "comments"'
          );
        });
    });
    it('PATCH returns 404 when searching for an valid id but there is no such article, vote up', () => {
      return request
        .patch(`/api/comments/5b8907a88c973b386d4b20af?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid params: Comment not found.');
        });
    });
    it('PATCH method returns status 200 and an updated comment, votes down', () => {
      return request
        .patch(`/api/comments/${commentsTestDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment).to.have.all.keys(
            'votes',
            '_id',
            'body',
            'belongs_to',
            'created_by',
            'created_at',
            '__v'
          );
          expect(res.body.comment.votes).to.equal(
            commentsTestDocs[0].votes - 1
          );
        });
    });
    it('PATCH returns 400 when searching for an invalid mongo ID, vote down', () => {
      return request
        .patch(`/api/comments/nonexistent_path?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Cast to ObjectId failed for value "nonexistent_path" at path "_id" for model "comments"'
          );
        });
    });
    it('PATCH returns 404 when searching for an valid id but there is no such article, vote down', () => {
      return request
        .patch(`/api/comments/5b8907a88c973b386d4b20af?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid params: Comment not found.');
        });
    });
  });

  describe('/api/users/:username', () => {
    it('GET method returns status 200 and an user with all the keys and the expected value for a key', () => {
      return request
        .get(`/api/users/${usersTestDocs[0].username}`)
        .expect(200)
        .then(res => {
          expect(res.body.userInfo).to.have.all.keys(
            '_id',
            'username',
            'name',
            'avatar_url',
            '__v'
          );
          expect(res.body.userInfo.name).to.equal(usersTestDocs[0].name);
        });
    });
    it('GET returns 404 when given an invalid id', () => {
      return request
        .get('/api/users/nonexistent_user')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(
            'Invalid params: There is no user with that nickname.'
          );
        });
    });
  });
  describe('/api/users', () => {
    it('GET method returns status 200 and all users', () => {
      return request
        .get(`/api/users`)
        .expect(200)
        .then(res => {
          expect(res.body.users[0]).to.have.all.keys(
            '_id',
            'username',
            'name',
            'avatar_url',
            '__v'
          );
          expect(res.body.users.length).to.equal(2);
        });
    });
  });
});
