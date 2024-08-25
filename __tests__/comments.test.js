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

describe("/api/articles/:article_id/comments", () => {
  test("200 - GET - will return an array of all comment objects with the properties of comment_id, votes, author, body, article_id and created_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
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
      .get("/api/articles/1234/comments")
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
  test("201 - POST - will return a successfully posted comment object with the request body properties of username and body and the comment properties of comment_id, votes, author, body, article_id and created_at in", () => {
    const newComment = {
      username: "rogersop",
      body: "What an interesting read!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        const comment = res.body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.votes).toBe(0);
        const createdAtInSeconds =
          new Date(comment.created_at).getTime() / 1000;
        const nowInSeconds = Date.now() / 1000;
        expect(createdAtInSeconds).toBeCloseTo(nowInSeconds, 1);
        expect(comment.author).toBe("rogersop");
        expect(comment.body).toBe("What an interesting read!");
        expect(comment.article_id).toBe(1);
      });
  });
  test("404 - POST - sends an appropriate status and error message when a non-exist article_id is used", () => {
    const newComment = {
      username: "rogersop",
      body: "What an interesting read!",
    };
    return request(app)
      .post("/api/articles/1234/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
  test("400 - POST - sends an appropriate status and error message when an invalid datatype is posted", () => {
    const newComment = {
      username: 20002,
      body: 123897,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - POST - sends an appropriate status and error message when an invalid article_id is passed", () => {
    const newComment = {
      name: "rogersop",
      comment: "What an interesting read!",
    };
    return request(app)
      .post("/api/articles/im-an-id/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - POST - sends an appropriate status and error message when an invalid comment object is posted", () => {
    const newComment = {
      name: "rogersop",
      comment: "What an interesting read!",
      votes: 10000000000000,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("204 - DELETE - sends an appropriate status code and message when a comment is deleted", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then((res) => {
        expect(res.statusCode).toBe(204);
      });
  });
  test("400 - DELETE - sends an appropriate status and error message when an invalid comment_id is passed", () => {
    return request(app)
      .delete("/api/comments/im-a-comment")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("404 - DELETE - sends an appropriate status and error message when a non-existent comment_id is used", () => {
    return request(app)
      .delete("/api/comments/3123")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
  test("200 - PATCH - will return an updated comment object, using a newVotes object (adding votes)", () => {
    const newVotes = { inc_votes: +100 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then((res) => {
        const comment = res.body.comment;
        expect(comment.votes).toBe(116);
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
      });
  });
  test("200 - PATCH - will return an updated comment object, using a newVotes object (subtracting votes)", () => {
    const newVotes = { inc_votes: -150 };
    return request(app)
      .patch("/api/comments/3")
      .send(newVotes)
      .expect(200)
      .then((res) => {
        const comment = res.body.comment;
        expect(comment.votes).toBe(-50);
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
      });
  });
  test("404 - PATCH - sends an appropriate status and error message when a non-exist comment_id is used", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/comments/2000")
      .send(newVotes)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
  test("400 - PATCH - sends an appropriate status and error message when an invalid datatype is posted", () => {
    const newVotes = { inc_votes: { votes: 10 } };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - PATCH - sends an appropriate status and error message when an invalid comment_id is passed", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/comments/im-an-id")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - PATCH - sends an appropriate status and error message when an invalid votes object is posted", () => {
    const newVotes = { inc_votes: "give me votes", even_more_votes: "hello" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});
