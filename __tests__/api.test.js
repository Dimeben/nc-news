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
        const endpoints = JSON.parse(res.text);
        expect(endpoints.apis["GET /api"]).toHaveProperty(
          "description",
          expect.any(String)
        );
        expect(endpoints.apis["GET /api/topics"]).toHaveProperty(
          "description",
          expect.any(String)
        );
        expect(endpoints.apis["GET /api/topics"]).toHaveProperty(
          "queries",
          expect.any(Array)
        );
        expect(endpoints.apis["GET /api/topics"]).toHaveProperty(
          "exampleResponse",
          expect.any(Object)
        );
        expect(endpoints.apis["GET /api/articles"]).toHaveProperty(
          "description",
          expect.any(String)
        );
        expect(endpoints.apis["GET /api/articles"]).toHaveProperty(
          "queries",
          expect.any(Array)
        );
        expect(endpoints.apis["GET /api/articles"]).toHaveProperty(
          "exampleResponse",
          expect.any(Object)
        );
      });
  });
});
