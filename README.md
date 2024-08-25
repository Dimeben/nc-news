<h1>Northcoders News API</h1>

<h2>Skills</h2>

<h3>
<strong> > JavaScript </strong><br>
<strong> > Express </strong><br>
<strong> > Jest </strong><br>
<strong> > SuperTest </strong><br>
<strong> > Postgres </strong><br>
<strong> > PSQL </strong><br>
<strong> > TDD </strong><br>
<strong> > FS/Promises </strong><br>
<strong> > Middleware </strong><br>
<strong> > Error-Handling </strong><br>
<strong> > Environment Variables </strong><br>
<strong> > Model View Controller </strong><br>
</h3>

<h2>Setup</h2>

<h3>
To begin, create 2 .env files:
</h3>

.env.test
<br>
.env.development

<h3>
In .env.test, write:
</h3>
PGDATABASE=nc_news_test

<h3>In .env.development, write:
</h3>

PGDATABASE=nc_news_test

> Double check that these .env files are .gitignored.

Run npm install

<h2>Endpoints</h2>

<h4>GET /api/topics</h4>

> responds with a list of topics

<h4>GET /api</h4>

> responds with a list of available endpoints

<h4>GET /api/articles/:article_id</h4>

> responds with a single article by article_id

<h4>GET /api/articles</h4>

> responds with a list of articles

<h4>GET /api/articles/:article_id/comments</h4>

> responds with a list of comments by article_id

<h4>POST /api/articles/:article_id/comments</h4>

> add a comment by article_id

<h4>PATCH /api/articles/:article_id</h4>

> updates an article by article_id

<h4>DELETE /api/comments/:comment_id</h4>

> deletes a comment by comment_id

<h4>GET /api/users</h4>

> responds with a list of users

<h4>GET /api/articles (queries)</h4>

> allows articles to be filtered and sorted

<h4>GET /api/articles/:article_id (comment count)</h4>

> adds a comment count to the response when retrieving a single article

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
