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
# xml to text large example
curl --location 'http://localhost:3000/xml/to/text?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./large-sample-xml.xml;type=text/xml"

# text to xml
curl --location 'http://localhost:3000/text/to/xml?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./sample-text.txt;type=text/plain"

# json to text
curl --location 'http://localhost:3000/json/to/text?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./sample-json.json;type=application/json"

# large text to xml
curl --location 'http://localhost:3000/text/to/xml?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./large-sample-text.txt;type=text/plain"
```

