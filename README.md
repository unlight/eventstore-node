# eventstore-node

A simple experiment using EventStoreDB in Docker with Node.js

## Workflow

```sh
yarn install
docker-compose up
open http://localhost:2113/web/index.html#/dashboard
npm run test
```

## Facts

1. const event = jsonEvent({ id: cuid() }) - wrong, id - accept guid only
