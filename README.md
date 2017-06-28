# Card Connectors Guide

## Overview

This project serves as a guide for writing connectors for the Hero Card service. A connector is an adapter with two responsibilities:

* Based on card requests, render cards. This would typically be achieved by accessing an external backend system. The card is a JSON structure that allows a client to display something meaningful to the user. The card also includes references to actions the user can take, relevant to the context of the card.
* Provide endpoints for all actions advertised in the card.

## Example

The Weather Connector accesses a fictitious crowd-sourced weather service to produce a card showing a requested ZIP code's weather. It also includes an action to report the actual current temperature for that ZIP.

A client requests a weather card and the following request is forwarded to the connector:
```
$ curl -H "Authorization: Bearer abcdef" \
-H "Content-Type: application/json" \
-X POST -d '{"tokens":{"zip":["30360"]}}' \
https://weather.acme.com/cards/requests
```
The card includes current weather conditions for ZIP code 30360, as well as an action to report the current temperature. If the user chooses that action, the following request will be forwarded to the connector:

```
$ curl -H "Authorization: Bearer abcdef" \
-H "Content-Type: application/x-www-form-urlencoded" \
-X POST -d "zip=30360&temperature=78" \
https://weather.acme.com/reports
```
A stubbed service based on the above can be found in the [samples section](samples/node) of this project.
