/*
* Copyright © 2017 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

"use strict";

exports.root = function (req, res) {
    const base = `${protocol(req)}://${host(req)}`;
    const body = {
        image: {href: `${base}/images/connector.png`},
        test_auth: {href: `${base}/test-auth`},
        object_types: [
            {
                name: "card",
                doc: {href: "https://github.com/vmwaresamples/card-connectors-guide/wiki/Card-Responses"},
                fields: {
                    zip: {capture_group: 1, regex: "([0-9]{5})(?:[- ][0-9]{4})?"}
                },
                endpoint: {href: `${base}/cards/requests`}
            }
        ]
    };
    res.json(body);
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
