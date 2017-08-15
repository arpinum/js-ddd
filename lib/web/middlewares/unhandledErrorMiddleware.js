'use strict';

const _ = require('lodash');
const {createLogger} = require('@arpinum/log');
const {
  AuthorizationError,
  FunctionalError,
  QueriedObjectNotFoundError,
  EntityNotFoundError,
  ClientError,
  ServerError,
  WebError,
  ResourceNotFoundError,
  ForbiddenError
} = require('../../errors');

function unhandledErrorMiddleware(options) {
  let _options = _.defaults({}, options, {
    log: createLogger({fileName: __filename}),
    verboseWebErrors: false
  });
  return (error, request, response, next) => {
    void next;
    logError(error);
    let webError = webErrorFrom(error);
    response
      .status(webError.code)
      .send({error: webError});
  };

  function logError(error) {
    let message = error.stack || error.message;
    _options.log.error(`Unhandled error (${message})`);
  }

  function webErrorFrom(error) {
    if (isA(error, EntityNotFoundError) || isA(error, QueriedObjectNotFoundError)) {
      return translateError(error, ResourceNotFoundError);
    }
    if (isA(error, AuthorizationError)) {
      return translateError(error, ForbiddenError);
    }
    if (isA(error, WebError)) {
      return error;
    }
    if (isA(error, FunctionalError)) {
      return translateError(error, ClientError);
    }
    return serverErrorFrom(error);
  }

  function serverErrorFrom(error) {
    let baseError = _options.verboseWebErrors ? error : {};
    return translateError(baseError, ServerError);
  }

  function translateError(sourceError, DestinationType) {
    let result = new DestinationType(sourceError.message);
    return _.defaults(result, sourceError);
  }

  function isA(error, constructor) {
    return error instanceof constructor;
  }
}

module.exports = unhandledErrorMiddleware;
