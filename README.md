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
# While in the /orderful/test/fixtures/ directory

# xml to text large example
curl --location 'http://localhost:3000/xml/to/text?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./large-sample-xml.xml;type=text/xml"

# xml to json 
curl --location 'http://localhost:3000/xml/to/json' -H 'Content-Type: multipart/form-data' --form "file=@./sample-xml.xml;type=text/xml"

# text to xml
curl --location 'http://localhost:3000/text/to/xml?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./sample-text.txt;type=text/plain"

# large text to xml
curl --location 'http://localhost:3000/text/to/xml?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./large-sample-text.txt;type=text/plain"

# json to text
curl --location 'http://localhost:3000/json/to/text?line=~&el=*' -H 'Content-Type: multipart/form-data' --form "file=@./sample-json.json;type=application/json"

# json to xml
curl --location 'http://localhost:3000/json/to/xml' -H 'Content-Type: multipart/form-data' --form "file=@./sample-json.json;type=application/json"
```

