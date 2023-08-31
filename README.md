# eventstore-node

A simple experiment using EventStoreDB in Docker with Node.js

## Workflow

```sh
docker-compose up
open http://localhost:2113/web/index.html#/dashboard
npm run test
```

## Facts

1. const event = jsonEvent({ id: cuid() }) - wrong, id - accept guid only

## Resources

-   https://gist.github.com/unlight/27dbe8693abd6b483c72b5abb1f9450d
