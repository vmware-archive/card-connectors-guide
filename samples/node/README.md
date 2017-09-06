# Weather Connector

This is a sample connector intended to demonstrate the connector spec. It is a Node.js application.

A weather card is requested based on a ZIP code. The card includes (hard-coded) current weather conditions as well
as an action for reporting the actual temperature for that ZIP code.

The listening port can be set using a command line argument.


## Running the connector
```
$ npm install
$ npm run start --  --port=3000
```

## Using Docker
Optionally, the connector can be built and run as a docker container:

```
$ docker build -t weather-connector .
$ docker run --rm -d -p 3000:3000 --name  weather-connector weather-connector --port=3000
```

## Testing the connector

Access [discovery](https://github.com/vmwaresamples/card-connectors-guide/wiki/Discovery), request cards, then report actual weather:
```
$ curl http://localhost:3000
```
```
$ curl -H "Authorization: Bearer abcdef" \
-H "Content-Type: application/json" \
-H "X-Routing-Prefix: /connectors/weather/" \
-X POST -d '{"tokens":{"zip":["30360"]}}' \
http://localhost:3000/cards/requests
```
```
$ curl -H "Authorization: Bearer abcdef" \
-H "Content-Type: application/x-www-form-urlencoded" \
-X POST -d "zip=30360&temperature=78" \
http://localhost:3000/reports
```
