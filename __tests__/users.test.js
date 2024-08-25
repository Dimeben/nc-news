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

describe("/api/users", () => {
  test("200 - GET - will return an article object with the given article_id, with the properties of author, title, article_id, body, topic, created_at, votes and article_img_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const users = res.body.users;
        expect(users).toHaveLength(4);
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
  test("404 - GET - sends an appropriate status and error message when an invalid URL is passed", () => {
    return request(app)
      .get("/api/use")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
});

describe("/api/users/:username", () => {
  test("200 - GET - will return a user object which has the passed username. It will have the properties of username, avatar_url and name", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then((res) => {
        const user = res.body.user;
        expect(user.username).toBe("lurker");
        expect(user.name).toBe("do_nothing");
        expect(user.avatar_url).toBe(
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
        );
      });
  });
  test("404 - GET - sends an appropriate status and error message when a non-exist username is used", () => {
    return request(app)
      .get("/api/users/bananaman")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
});
