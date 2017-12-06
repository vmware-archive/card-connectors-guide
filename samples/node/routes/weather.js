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
    const zips = req.body.tokens.zip || [];

    // Real connectors will probably insist on receiving X-Routing-Prefix.
    // We will be more lax here.
    const routingPrefix = req.headers['x-routing-prefix'] || '/';

    res.json({cards: zips.map(function(zip){
      return toCard(zip, routingPrefix);
    })});
};

exports.testAuth = function(req, res) {
  res.status(200).send();
}

exports.reportWeather = function (req, res) {
    console.log(`Reporting temperature of ${req.body.temperature} for ${req.body.zip}`);
    res.status(200).end();
};

function toCard(zip, routingPrefix) {
    return {
        id: uuidV4(),
        template: {
            href: `${routingPrefix}templates/generic.hbs`
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
                id: uuidV4(),
                action_key: "USER_INPUT",
                label: "Report weather",
                completed_label: "Weather reported successfully",
                url: {
                    href: `${routingPrefix}reports`
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
