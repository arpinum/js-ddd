'use strict';

const _ = require('lodash');

function latencySimulatorMiddleware(options) {
  let _options = _.defaults({}, options, {
    enabled: false,
    minDelayInMs: 200,
    maxDelayInMs: 600
  });
  return (request, response, next) => {
    if (_options.enabled) {
      setTimeout(next, _.random(_options.minDelayInMs, _options.maxDelayInMs));
    } else {
      next();
    }
  };
}

module.exports = latencySimulatorMiddleware;
