/*
* Copyright © 2017 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

"use strict";

const uuidV4 = require('uuid/v4');

exports.requestCards = function(req, res) {
    if (!req.body.tokens) {
        res.status(400).send("Missing tokens field");
        return;
    }

    // Treat missing zips and empty zips the same way
    const zips = req.body.tokens.zip ? req.body.tokens.zip : [];

    res.json({cards: zips.map(toCard)});
};

exports.reportWeather = function (req, res) {
    console.log(`Reporting temperature of ${req.body.temperature} for ${req.body.zip}`);
    res.status(200).end();
};

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