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

jest.setTimeout(10000);

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
  test("200 - GET - will return an article object will all properties and a comment_count property", () => {
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
        expect(article).toHaveProperty("comment_count", expect.any(Number));
      });
  });
  test("404 - GET - sends an appropriate status and error message when a non-exist article_id is used", () => {
    return request(app)
      .get("/api/articles/1234")
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
  test("200 - PATCH - will return an updated article object, using a newVotes object (adding votes)", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
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
        expect(article.votes).toBe(110);
      });
  });
  test("200 - PATCH - will return an updated article object, using a newVotes object (subtracting votes)", () => {
    const newVotes = { inc_votes: -40 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
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
        expect(article.votes).toBe(60);
      });
  });
  test("404 - PATCH - sends an appropriate status and error message when a non-exist article_id is used", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/99")
      .send(newVotes)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found");
      });
  });
  test("400 - PATCH - sends an appropriate status and error message when an invalid datatype is posted", () => {
    const newVotes = { inc_votes: "41111" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - PATCH - sends an appropriate status and error message when an invalid article_id is passed", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/im-an-id")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - PATCH - sends an appropriate status and error message when an invalid votes object is posted", () => {
    const newVotes = { inc_votes: "give me votes", even_more_votes: "hello" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
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
          expect(article).toHaveProperty("comment_count", expect.any(Number));
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
          expect(article).toHaveProperty("comment_count");
          expect(typeof Number(article.comment_count)).toBe("number");
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
  test("200 - GET - will return an array of all article objects sorted by a valid query column name and ordered in a valid query order - title/asc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toBeSortedBy("title", { ascending: true });
      });
  });
  test("200 - GET - will return an array of all article objects sorted by a valid query column name and ordered in a valid query order - author/desc", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=desc")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid sort_by column is passed", () => {
    return request(app)
      .get("/api/articles?sort_by=banana33&order=desc")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid order is passed", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=how-should-i-know")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("200 - GET - will return an array of all article objects which the topic query is omitted", () => {
    return request(app)
      .get("/api/articles?topic=")
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
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200 - GET - will return an array of all article objects which have a topic property of the passed query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(12);
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("400 - GET - sends an appropriate status and error message when an invalid topic is passed", () => {
    return request(app)
      .get("/api/articles?topic=banana123")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("201 - POST - will return a successfully posted article object with the request body properties of author, title, body, topic and article_img_url", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "What a time to be alive",
      body: "Amazing!",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then((res) => {
        const article = res.body.article;
        expect(article.article_id).toBe(14);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("What a time to be alive");
        expect(article.body).toBe("Amazing!");
        expect(article.topic).toBe("cats");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
        expect(article.votes).toBe(0);
        const createdAtInSeconds =
          new Date(article.created_at).getTime() / 1000;
        const nowInSeconds = Date.now() / 1000;
        expect(createdAtInSeconds).toBeCloseTo(nowInSeconds, 1);
        expect(article.comment_count).toBe(0);
      });
  });
  test("400 - POST - sends an appropriate status and error message when an invalid comment object is posted", () => {
    const newArticle = {
      author: "butter_bridge",
      title: 11000111001,
      body: 111,
      topic: 10101,
      article_img_url:
        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});
