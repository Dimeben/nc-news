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

describe("/api/topics", () => {
  test("200 - GET - will return all topics in an array of objects, with the properties of slug & description ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body.topics;
        expect(topics).toHaveLength(3);
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("404 - GET - sends an appropriate status and error message when an invalid URL is passed", () => {
    return request(app)
      .get("/api/nothing_here")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
  test("201 - POST - will return a successfully posted comment object with the request body properties of username and body and the comment properties of comment_id, votes, author, body, article_id and created_at in", () => {
    const newTopic = { slug: "Anime", description: "Japanese cartoons" };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then((res) => {
        const topic = res.body.topic;
        expect(topic.slug).toBe("Anime");
        expect(topic.description).toBe("Japanese cartoons");
      });
  });
  test("400 - POST - sends an appropriate status and error message when an invalid datatype is posted", () => {
    const newTopic = { slug: "Anime", description: 12345 };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - POST - sends an appropriate status and error message when an invalid comment object is posted", () => {
    const newTopic = { topics: "Anime", facts: "What a fact!" };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});
