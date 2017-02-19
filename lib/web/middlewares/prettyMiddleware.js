'use strict';

const _ = require('lodash');
const {objectToHtml} = require('../objectToHtml');

function prettyMiddleware() {
  return (request, response, next) => {
    if (request.query.pretty !== undefined) {
      let originalSend = response.send;
      response.send = object => {
        let body = object;
        if (_.isObject(object)) {
          body = objectToHtml(object);
        }
        originalSend.call(response, body);
      };
    }
    next();
  };
}

module.exports = {prettyMiddleware};
