'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//const methodOverride = require('method-override');
const _ = require('lodash');

const database = require('./database');

const app = express();

app.set('view engine', 'ejs')

app.use(cors());
app.use(bodyParser.json())
app.use(cookieParser());

app.post('/save', (req, res, next) => {
    const payload = _.defaultsDeep({}, req.body);
    // ref: https://snyk.io/vuln/SNYK-JS-LODASH-450202
    // const payload = '{"constructor": {"prototype": {"a0": true}}}'
    if(({})[`a0`] === true) {
        console.log(`vulnerable to prototype pollution via ${payload}`);
    }
    return payload
});

app.post('/update', (req, res, next) => {
    const payload = _.merge({}, req.body);
    // ref: https://snyk.io/vuln/SNYK-JS-LODASH-450202
    // const payload = '{"constructor": {"prototype": {"a0": true}}}'
    if(({})[`a0`] === true) {
        console.log(`vulnerable to prototype pollution via ${payload}`);
    }
    return payload
});

app.get('/header-injection', (req, res, next) => {
    const userInput = req.query.requestid || '12345-12345';
    res.set('X-Request-ID', userInput);

    res.render('header-injection', {
        header: userInput
    });
});

app.get('/xss', (req, res, next) => {
    const userInput = req.query.input || '<script>alert("uhoh")</script>';
    res.set('X-Request-ID', userInput);
    res.render('xss', {
        userInput
    });
});

app.post('/users',  async (req, res, next) => {
    const users = await database.getUsersByMetadata(req.query.input);
    const more_users = await database.getUsersByMetadataJson(req.query.input);
    res.status(200).json([].concat[users, more_users]);
});

async function main() {
    await database.init();
    console.log('database initialized');

    app.listen(8080);
    console.log('app running on 8080');
}