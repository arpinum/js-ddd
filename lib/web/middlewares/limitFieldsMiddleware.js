'use strict';

const _ = require('lodash');

function limitFieldsMiddleware() {
  return (request, response, next) => {
    if (request.query.fields !== undefined) {
      let originalSend = response.send;
      response.send = object => {
        let body = object;
        if (_.isArray(object)) {
          body = _.map(object, element =>
            _.pick(element, request.query.fields)
          );
        } else if (_.isObject(object)) {
          body = _.pick(object, request.query.fields);
        }
        originalSend.call(response, body);
      };
    }
    next();
  };
}

module.exports = limitFieldsMiddleware;
