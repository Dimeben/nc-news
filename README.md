# Northcoders News API

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

> Made using Node.js v22.4.1

#### Install PostgreSQL by following this link:

[Install PostgreSQL](https://www.postgresql.org/download/)

> Made using PostgreSQL 14.13

#### Install the dependencies by running the following in your terminal:

> npm install <br>
> npm install jest <br>
> npm install supertest <br>
> npm install express <br>
> npm install jest-sorted <br>
> npm install pg-format <br>
> npm install dotenv --save <br>
> npm install nodemon <br>

#### Initialise the databases by running:

> npm run setup-db <br>

#### Seed the databases by running:

> npm run seed <br>

#### Run the tests by running:

> npm test <br>

#### Initialise the server on port 8080 by running:

> npm run start <br>

#### To access the endpoints on your browser, append them to the following base URL:

> https://nc-news-bpw3.onrender.com

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

#### GET /api/articles?sortby=

#### GET /api/articles?order=

Allows articles to be filtered and sorted.

#### GET /api/articles/:articleid (comment count)

Adds a comment count to the response when retrieving a single article.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
