/*
* Copyright © 2017 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

"use strict";

const uuidV4 = require('uuid/v4');
const sha1 = require('sha1');

exports.requestCards = function(req, res) {
    console.log('cards called: ', req.body);
    let tokenZip = (req.body.tokens && req.body.tokens.zip) ? req.body.tokens.zip : null;
    let configZip = (req.body.config && req.body.config.defaultZip) ? [req.body.config.defaultZip] : null;

    if (!tokenZip && !configZip) {
        res.status(400).send("Missing zip.  Please provide one in tokens or config.");
        return;
    }

    console.log(`tokenZip: ${tokenZip}`);
    console.log(`configZip: ${configZip}`);

    const zips = tokenZip ? tokenZip : configZip;

    console.log(`Zips: ${zips}`);

    // Real connectors will probably insist on receiving X-Routing-Prefix.
    // We will be more lax here.
    const routingPrefix = req.headers['x-routing-prefix'] || '/';

    res.json({objects: zips.map(function(zip) {
      return toCard(zip, routingPrefix);
    })});
};

exports.testAuth = function(req, res) {
  res.status(200).send();
}

let lastReported = {};

exports.reportWeather = function (req, res) {
    console.log(`Reporting temperature of ${req.body.temperature} for ${req.body.zip}`);
    lastReported[req.body.zip] = req.body.temperature;
    res.status(200).end();
};

exports.clearData = function (req, res) {
    console.log('Clearing all reported data');
    lastReported = {};
    res.status(200).end();
}

function toCard(zip, routingPrefix) {
    return {
        id: uuidV4(),
        template: {
            href: `${routingPrefix}templates/generic.hbs`
        },
        header: {
            title: `Weather forecast for ${zip}`
        },
        hash: sha1(zip),
        body: {
            description: "The weather is rather nice at the moment",
            fields: [
                {
                    type: "GENERAL",
                    title: "Temperature",
                    description: `${lastReported[zip] || '75'}`
                },
                {
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
