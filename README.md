# API Project: URL Shortener Microservice for freeCodeCamp

[![Run on Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-urlshortener)](https://boilerplate-project-urlshortener.bryanw1.repl.co/)

### Description

A microservice that creates a shortened url for any valid site. Enter a valid website below to be provided a short url id.


#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[[this_project_url]/api/shorturl/1](https://boilerplate-project-urlshortener.bryanw1.repl.co/api/shorturl/1)

#### Will redirect to:

https://www.google.com

#### Setup

1. `npm install` to install all the packages.
2. Create `.env` file and assign your Mongodb url to `DB_URI`.
3. `npm start` to start server and move onto `localhost:3000`.