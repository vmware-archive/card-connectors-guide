# Mobile Flows Connectors Guide

## Overview

This serves as a guide for writing connectors for the Mobile Flows. A connector is an adapter with two responsibilities:

* Based on object requests, render objects. This would typically be achieved by accessing an external backend system. The object is a JSON structure that allows a client to display something meaningful to the user. The object also includes references to actions the user can take, relevant to the context of the object. Note that the Weather connector in the [samples section](samples/node) uses Card, a type of oject as defined here : https://github.com/vmware-samples/card-connectors-guide/wiki/Card-Responses
* Provide endpoints for all actions advertised in the object.

All communication with a connector is over HTTPS. A connector can be written in any language that allows the developer to create HTTP endpoints. 

## Example

The Weather Connector accesses a fictitious crowd-sourced weather service to produce a card showing a requested ZIP code's weather. It also includes an action to report the actual current temperature for that ZIP.

A client requests a weather card and the following request is forwarded to the connector:
```
$ curl -H "Authorization: Bearer mobileflows-token" \
       -H "X-Connector-Authorization: Bearer backend-token" \
       -H "Content-Type: application/json" \
       -H "Accept: application/json" \
       -H "X-Routing-Prefix: /connectors/weather/" \
       -X POST \
       -d '{"tokens":{"zip":["30360"]}}' \
       https://weather-connector.acme.com/cards/requests
```
The card includes current weather conditions for ZIP code 30360, as well as an action to report the current temperature. If the user chooses that action, the following request will be forwarded to the connector:

```
$ curl -H "Authorization: Bearer mobileflows-token" \
       -H "X-Connector-Authorization: Bearer backend-token" \
       -H "Content-Type: application/x-www-form-urlencoded" \
       -H "Accept: application/json" \
       -X POST \
       -d "zip=30360&temperature=78" \
       https://weather-connector.acme.com/reports
```
A stubbed service based on the above can be found in the [samples section](samples/node) of this project.

## Further reading

For a detailed specification, please see the [wiki](https://github.com/vmware-samples/card-connectors-guide/wiki).
