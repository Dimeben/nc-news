# Northcoders News API

To begin, create 2 .env files:

.env.test
.env.development

In .env.test, write:

PGDATABASE=nc_news_test

In .env.development, write:

PGDATABASE=nc_news_test

Double check that these .env files are .gitignored.

Run npm install

# Endpoints

GET /api/topics

responds with a list of topics

GET /api

responds with a list of available endpoints

GET /api/articles/:article_id

responds with a single article by article_id

GET /api/articles

responds with a list of articles

GET /api/articles/:article_id/comments

responds with a list of comments by article_id

POST /api/articles/:article_id/comments

add a comment by article_id

PATCH /api/articles/:article_id

updates an article by article_id

DELETE /api/comments/:comment_id

deletes a comment by comment_id

GET /api/users

responds with a list of users

GET /api/articles (queries)

allows articles to be filtered and sorted

GET /api/articles/:article_id (comment count)

adds a comment count to the response when retrieving a single article

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
