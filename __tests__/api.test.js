const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
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

describe("/api", () => {
  test("200 - GET - will return the documentation detailing all of the available API endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const endpoints = res.body.apis;
        expect(endpoints).toHaveProperty("GET /api");
        expect(endpoints).toHaveProperty("GET /api/topics");
        expect(endpoints).toHaveProperty("GET /api/articles");
        expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
        expect(endpoints).toHaveProperty(
          "GET /api/articles/:article_id/comments"
        );
        expect(endpoints).toHaveProperty(
          "POST /api/articles/:article_id/comments"
        );
        expect(endpoints).toHaveProperty("POST /api/articles");
        expect(endpoints).toHaveProperty("PATCH /api/articles/:article_id");
        expect(endpoints).toHaveProperty("DELETE /api/comments/:comment_id");
        expect(endpoints).toHaveProperty("PATCH /api/comments/:comment_id");
        expect(endpoints).toHaveProperty("GET /api/users");
        expect(endpoints).toHaveProperty("GET /api/users/:username");
      });
  });
  test("404 - GET - sends an appropriate status and error message when an invalid URL is passed", () => {
    return request(app)
      .get("/ap")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
});
