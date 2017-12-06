/*
* Copyright © 2017 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const commandLineArgs = require('command-line-args');
const weather = require('./routes/weather');
const discovery = require('./routes/discovery');

const optionDefinitions = [
    {name: 'port', type: Number, defaultValue: 3000}
];

const options = commandLineArgs(optionDefinitions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.set('trust proxy', true);
app.use(['/cards/requests', '/reports'], function (req, res, next) {
    const authorization = req.header("authorization");
    if (authorization) {
        console.log(`Client passed "${authorization}". We should authenticate using a public key from VMware Identity Manager`);
        next();
    } else {
        res.status(401).send("Missing Authorization header");
    }
});

app.get('/', discovery.root);
app.use(express.static('public'))

// Request cards
app.post('/cards/requests', weather.requestCards);

// Test authentication
app.get('/test-auth', weather.testAuth);

// Perform an action. Note that "/connectors/weather/" is required by Hero to route here, but "/reports"
// is all we see here.
app.post('/reports', weather.reportWeather);

app.listen(options.port, function () {
    console.log(`Connector listening on port ${options.port}.`);
});
