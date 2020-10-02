'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const url = new mongoose.Schema({
    original_url: {
        type: String,
        required: true,
        unique: true
        },
    short_url: {
        type: Number,
        required: true,
        unique: true
        }
}, {timestamps: true});

const Url = mongoose.model('url', url);

app.use(cors());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new', async (req, res) => {
        if (!(await checkUrlValid(sanitizeUrl(req.body.url)))) res.json({error: 'Invalid Url'});

        const found = await findSite({original_url: req.body.url});
        const shortUrl = found ? found.short_url : await findLastShortUrl() + 1 || 1;
        const entry = {
                original_url: req.body.url,
                short_url: shortUrl
            };
        if (!found) await Url.create(entry);
        
        res.json(entry);
        

    
    // if (!checked) await res.json({error: 'invalid URL'});

    
});

app.get('/api/shorturl/:url', async (req, res) => {
    const found = await findSite({short_url: req.params.url});

    if (!found) res.json({error: 'invalid URL'});
    else res.redirect(found.original_url);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

/**
 * Finds if url exists within the mongodb collection. returns null if not found. 
 * @param  {Object} field - search field to find site 
 * @return {object}       - returns an object containing the site data
 */
function findSite(field){
    return Url.findOne(field).exec()
};

/**
 * Finds the 'short_url' value of the last created entry 
 * @return {Int}       - returns the short_url value
 */
async function findLastShortUrl(){
    const lastEntry = await Url.find({}).sort({createdAt: -1}).limit(1).exec()
    return lastEntry[0]['short_url'];
}

/**
 * Checks if url is valid.
 * @param  {String} url  - url to be checked 
 * @return {Boolean}     - returns true if url/site is valid. Else, return false.
 */
function checkUrlValid(url){
    console.log(url.length)
    return new Promise ((res, rej) => dns.lookup(url, (err, address, family) => {
        console.log(err)
        if (err) res(false);
        res(true);
        }));
};

/**
 * Sanitizes the url so that it will be valid for DNS lookup.
 * @param  {String} url  - url to be checked 
 * @return {String}      - returns sanitized url
 */
function sanitizeUrl(url){
    const regex = /^(https:\/\/|http:\/\/)/i;
    return url.trim().replace(regex, '');
}