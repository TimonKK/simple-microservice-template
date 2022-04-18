# simple-microservice-template
The very simple microservice with HTTP REST API endpoints with NATS as provider of externap api.

## Config
The default config is `src/config.ts`. The main ENV variables are:
1. ENV_NAME,
2. PORT,
3. NATS_URI,
4. NATS_USER,
5. NATS_PASSWORD

For local NATS setup you might use docker:
`docker run -p 4222:4222 -ti nats:latest`

## Preparation

1. `npm i`
2. `npm run build` or `npm run watch` for develop


## Test

`npm run test`