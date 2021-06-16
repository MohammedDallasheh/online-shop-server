const express = require('express');
var fs = require('fs');
var path = require('path');
const morgan = require('morgan');
const file = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {
    flags: 'a',
  }
);
morgan.token('baseUrl', function (req, res) {
  return req.path;
});
morgan.token('reqBody', function (req, res) {
  return JSON.stringify(req.body);
});
morgan.token('reqQuery', function (req, res) {
  return JSON.stringify(req.query);
});
morgan.token('reqParams', function (req, res) {
  return JSON.stringify(req.params);
});
console.log(
  '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'
);
const logFormat = `Method- :method
***Url- :baseUrl
Params- :reqParams
*Query- :reqQuery
**Body- :reqBody
Status- :status
***Res- :response-time ms
**Date- :date[iso]
--------------------------------------------------`;
const logFormatToFile = `
  {"Method":":method",
     "Url":":baseUrl",
    "Body":":reqBody",
  "Params":":reqQuery",
  "Status":":status",
     "Res":":response-time ms",
    "Date":":date[iso]"}
  `;
const logger = (req, res, next) => {
  const newMorgan = (...props) =>
    morgan(...props)(req, res, () => {});

  // newMorgan('tiny');
  newMorgan(logFormat);
  // newMorgan(logFormat, {
  //   stream: file,
  // });

  next();
};

module.exports = { logger };
