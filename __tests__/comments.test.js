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

describe("/api/articles/:article_id/comments", () => {
  test("200 - GET - will return an array of all comment objects with the properties of comment_id, votes, author, body, article_id and created_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toHaveLength(10);
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200 - GET - sends empty array when a valid article_id is used but their are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toHaveLength(0);
        expect(Array.isArray(comments)).toBe(true);
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
      name: 123,
      comment: "What an interesting read!",
      votes: 100005,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("200 - GET - will return an array of 10 comment objects when the limit query is used without a value. A total_count property will show how many comment are available in total", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=")
      .expect(200)
      .then((res) => {
        const response = res.body;
        expect(response.comments).toHaveLength(10);
        expect(response.total_count).toBe(11);
      });
  });
  test("200 - GET - will return an array of 5 comment objects when the limit query is used without a value of 5. A total_count property will show how many comment are available in total", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then((res) => {
        const response = res.body;
        expect(response.comments).toHaveLength(5);
        expect(response.total_count).toBe(11);
      });
  });
  test("200 - GET - (1/3) - will return an array of 5 comment objects, from objects 1 - 5 when p=1 is used. A total_count property will show how many comment are available in total", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=1")
      .expect(200)
      .then((res) => {
        const response = res.body;
        expect(response.comments).toHaveLength(5);
        expect(response.comments[0].comment_id).toBe(5);
        expect(response.comments[1].comment_id).toBe(2);
        expect(response.comments[2].comment_id).toBe(18);
        expect(response.comments[3].comment_id).toBe(13);
        expect(response.comments[4].comment_id).toBe(7);
        expect(response.total_count).toBe(11);
      });
  });
  test("200 - GET - (2/3) - will return an array of 5 comment objects, from objects 6 - 10 when p=2 is used. A total_count property will show how many comment are available in total", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=2")
      .expect(200)
      .then((res) => {
        const response = res.body;
        expect(response.comments).toHaveLength(5);
        expect(response.comments[0].comment_id).toBe(8);
        expect(response.comments[1].comment_id).toBe(6);
        expect(response.comments[2].comment_id).toBe(12);
        expect(response.comments[3].comment_id).toBe(3);
        expect(response.comments[4].comment_id).toBe(4);
        expect(response.total_count).toBe(11);
      });
  });
  test("200 - GET - (3/3) - will return an array of 3 comment objects, from objects 11 - 13 when p=3 is used. A total_count property will show how many comment are available in total", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=3")
      .expect(200)
      .then((res) => {
        const response = res.body;
        expect(response.comments).toHaveLength(1);
        expect(response.comments[0].comment_id).toBe(9);
        expect(response.total_count).toBe(11);
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid limit is passed", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=ABC&p=1")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid page is passed", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=ABC")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid article id is passed", () => {
    return request(app)
      .get("/api/articles/im-an-id/comments?limit=5&p=1000")
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

describe("/api/articles/:articleid/comments - Non-existent article ID", () => {
  test("404 - GET - sends an appropriate status and error message when a non-existent article_id is used", () => {
    return request(app)
      .get("/api/articles/1234/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
});
describe("/api/comments/:commentid - Non-existent comment ID", () => {
  test("404 - GET - sends an appropriate status and error message when a non-existent comment_id is used", () => {
    return request(app)
      .get("/api/comments/1234")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
});
