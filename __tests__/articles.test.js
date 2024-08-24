const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const jestSorted = require("jest-sorted");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("/api/articles/:article_id", () => {
  test("200 - GET - will return an article object with the given article_id, with the properties of author, title, article_id, body, topic, created_at, votes and article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("404 - GET - sends an appropriate status and error message when a non-exist article_id is used", () => {
    return request(app)
      .get("/api/articles/1000000000000000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid article_id is used", () => {
    return request(app)
      .get("/api/articles/Im-an-id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("200 - GET - will return an array of all article objects with the properties of author, title, article_id, topic, votes, article_img_url and created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(13);
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).not.toHaveProperty("body");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200 - GET - will return an array of all article objects with a comment_count property. This will be the total count of comments with this article_id.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  test("404 - GET - sends an appropriate status and error message when an invalid URL is passed", () => {
    return request(app)
      .get("/app/artcles")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("200 - GET - will return an array of all comment objects with the properties of comment_id, votes, author, body, article_id and create_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        console.log(comments);
        expect(comments).toHaveLength(11);
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404 - GET - sends an appropriate status and error message when a non-exist article_id is used", () => {
    return request(app)
      .get("/api/articles/1000000000000000/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid article_id is used", () => {
    return request(app)
      .get("/api/articles/Im-an-id/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});
