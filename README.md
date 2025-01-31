# File Upload and Convert API

## Description

Tool for converting files to and from XML, String, or JSON

## Project setup

```bash
$ git@github.com:Jordan-Bortolotti/orderful.git
$ cd orderful
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
$ npm run start:dev | pino-pretty
```

## Run tests

```bash
# unit tests from project root
$ npm run test

# e2e tests from project root
$ npm run test:e2e

# test coverage from project root
$ npm run test:cov
```

## Example requests
```bash
# JSON to Text, must include 2 query parameters (line and el) to act as line separator and element separators when generating the Text result
curl --location 'http://<HostName>:3000/json/to/text?line=%5E&el=*' \
--form 'file=@"<ProjectDirectory>/test/sample-json.json"'
```

