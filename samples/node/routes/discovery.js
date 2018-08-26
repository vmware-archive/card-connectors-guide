/*
* Copyright © 2017 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

"use strict";

const fs = require('fs');

exports.root = function (req, res) {
    const base = `${protocol(req)}://${host(req)}`;
    fs.readFile('./discovery/metadata.json', 'utf8', function (err, contents) {
        res.setHeader('Content-Type', 'application/json');
        res.send(
            contents.replace(new RegExp('@@_CONNECTOR_HOST_@@', 'g'), base)
        );
    });
};

function protocol(req) {
    // Express looks for X-Forwarded-Proto
    return req.protocol;
}

function host(req) {
    // request.hostname is broken in Express 4 so we have to deal with the X-Forwarded- headers ourselves
    const forwardedHost = req.headers['x-forwarded-host'];
    const forwardedPort = req.headers['x-forwarded-port'];
    if (forwardedHost && forwardedPort) {
        return forwardedHost + ':' + forwardedPort;
    } else {
        return req.headers.host;
    }
}
