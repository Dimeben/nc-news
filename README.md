# Northcoders News API

#### To access the endpoints on your browser, append them to the following base URL:

> https://nc-news-bpw3.onrender.com

## Skills

- **JavaScript**
- **Express**
- **Jest**
- **SuperTest**
- **Postgres**
- **PSQL**
- **TDD**
- **FS/Promises**
- **Middleware**
- **Error-Handling**
- **Environment Variables**
- **Model View Controller**
- **Hosting**
- **Pagination**
- **Continuous Integration**
- **Continuous Delivery**

## Setup

#### Clone the repository:

> Click the green `Code` button and copy the URL <br>

#### In your local machine's terminal, run:

> git clone https://github.com/Dimeben/nc-news.git <br>

#### Once it has downloaded, run:

> cd /nc-news <br>
> code . <br>

#### To begin, create two `.env` files:

> `.env.test` <br>

> `.env.development`

#### In `.env.test`, write:

> PGDATABASE=nc_news_test

#### In .env.development, write:

> PGDATABASE=nc_news_test <br>

##### Double-check that these `.env` files are included in your `.gitignore`

#### Install npm & Node.js by following this link:

[Install npm and Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### Install the dependencies by running the following in your terminal:

> npm i

#### Initialise the databases by running:

> npm run setup-db <br>

#### Seed the databases by running:

> npm run seed <br>

#### Run the tests by running:

> npm test <br>

#### Initialise the server on port 8080 by running:

> npm run start <br>

## Endpoints

#### GET /api/topics

Responds with a list of topics.

#### GET /api

Responds with a list of available endpoints.

#### GET /api/articles/:articleid

Responds with a single article by article_id.

#### GET /api/articles

Responds with a list of articles.

#### GET /api/articles/:articleid/comments

Responds with a list of comments by article_id.

#### POST /api/articles/:articleid/comments

Adds a comment by article_id.

#### PATCH /api/articles/:articleid

Updates an article by article_id.

#### DELETE /api/comments/:commentid

Deletes a comment by comment_id.

#### GET /api/users

Responds with a list of users.

#### GET /api/articles?topic=

Allows articles to be filtered the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles.

#### GET /api/articles?sortby=

Allows articles to be sorted by any valid column (defaults to the created_at date).

#### GET /api/articles?order=

Allows articles to be ordered by ascending or descending (defaults to descending).

#### GET /api/articles/:articleid (comment count)

Adds a comment count to the response when retrieving a single article.

#### GET /api/users/:username

return a user by username.

#### PATCH /api/comments/:comment_id

update the votes on a comment given the comment's comment_id.

#### POST /api/articles

add a new article.

#### GET /api/articles (pagination)

Accepts the following queries:

> `limit`, which limits the number of responses (defaults to 10). <br> `p`, stands for page and specifies the page at which to start (calculated using limit).<br>

Responds with:<br>

> the articles paginated according to the above inputs.<br> `total_count` property, displaying the total number of articles (this should display the total number of articles with any filters applied, discounting the limit).

#### /api/articles/:article_id/comments (pagination)

Accepts the following queries:

> `limit`, which limits the number of responses (defaults to 10). <br> `p`, stands for page and specifies the page at which to start (calculated using limit).<br>

Responds with:<br>

> the articles paginated according to the above inputs.<br>

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
