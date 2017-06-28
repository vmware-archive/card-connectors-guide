/*
* Copyright © 2017 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const uuidV4 = require('uuid/v4');
const app = express();

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    {name: 'port', type: Number, defaultValue: 3000}
];

const options = commandLineArgs(optionDefinitions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(function (req, res, next) {
    const authorization = req.header("authorization");
    if (authorization) {
        console.log(`Client passed "${authorization}". We should authenticate using a public key from VMware Identity Manager`);
        next();
    } else {
        res.status(401).send("Missing Authorization header");
    }
});

// Request cards
app.post('/cards/requests', function (req, res) {
    if (!req.body.tokens) {
        res.status(400).send("Missing tokens field");
        return;
    }

    // Treat missing zips and empty zips the same way
    const zips = req.body.tokens.zip ? req.body.tokens.zip : [];

    res.json({cards: zips.map(toCard)});
});

// Perform an action. Note that "/connectors/weather/" is required by Hero to route here, but "/reports"
// is all we see here.
app.post("/reports", function (req, res) {
    console.log(`Reporting temperature of ${req.body.temperature} for ${req.body.zip}`);
    res.status(200).end();
});

app.listen(options.port, function () {
    console.log(`Connector listening on port ${options.port}.`);
});

function toCard(zip) {
    return {
        id: uuidV4(),
        connector_id: "weather",
        name: "Weather connector",
        template: {
            href: "/connectors/weather/templates/generic.hbs"
        },
        header: {
            title: `Weather forecast for ${zip}`
        },
        body: {
            description: "The weather is rather nice at the moment",
            fields: [
                {
                    type: "GENERAL",
                    title: "Temperature",
                    description: "75"
                }, {
                    type: "GENERAL",
                    title: "Conditions",
                    description: "Sunny"
                }
            ]
        },
        actions: [
            {
                id: `report_weather_${zip}`,
                action_key: "REPORT_WEATHER",
                label: "Report weather",
                url: {
                    href: "/connectors/weather/reports"
                },
                type: "POST",
                request: {
                    zip: zip
                },
                user_input: [
                    {
                        id: "temperature",
                        label: `Please enter temperature for ${zip}`
                    }
                ]
            }
        ]
    };
}

