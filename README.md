# File Upload and Convert API

## Description

Tool for converting files to and from XML, String, or JSON

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Developer setup

```bash
$ npm install
# for improved log formatting
$ npm install -g pino-pretty
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Example requests
```bash
curl --location 'http://<HostName>:3000/json/to/text?line=%5E&el=*' \
--form 'file=@"<ProjectDirectory>/test/sample-json.json"'
```

