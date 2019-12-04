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
        actions: {
            clear: {
                url: {
                    href: `${base}/clear`
                },
                user_input: [],
                request: {},
                label: {
                    'en-US': 'Clear Reported Data'
                },
                type: 'POST',
                action_key: 'DIRECT'
            }
        },
        object_types: {
            card: {
                doc: {href: "https://github.com/vmware-samples/card-connectors-guide/wiki/Card-Responses"},
                fields: {
                    zip: {capture_group: 1, regex: "([0-9]{5})(?:[- ][0-9]{4})?"}
                },
                pollable: true,
                endpoint: {href: `${base}/cards/requests`}
            }
        },
        // Sample config.  For full spec see: https://vmware-samples.github.io/card-connectors-guide/#schema/connector-discovery-schema.json
        config: {
            defaultZip: {
                type: 'STRING',
                label: {
                    'en-US': 'Default Zip Code',
                    'es-ES': 'Código Postal predeterminado'
                },
                description: {
                    'en-US': 'Default Zip Code that will be used for all requests which do not include a Zip Code',
                    'es-ES': 'Código Postal predeterminado que se usará para todas las solicitudes que no incluyan un Código Postal'
                },
                validators: [
                    {
                        type: 'regex',
                        value: '([0-9]{5})(?:[- ][0-9]{4})?',
                        description: {
                            'en-US': 'Connector supports the basic 5 digit Zip Code format as well as expanded ZIP+4',
                            'es-ES': 'El conector admite el formato básico de código postal de 5 dígitos y Zip expandido Zip+4'
                        }
                    },
                    {
                        type: 'max_length',
                        value: '10',
                        description: {
                            'en-US': 'Default Zip Code must not be more than 10 characters',
                            'es-ES': 'El código postal predeterminado no debe tener más de 10 caracteres'
                        }
                    }
                ]
            } 
        }
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
