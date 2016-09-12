'use strict';

const _ = require('lodash');

function latencySimulatorMiddleware(options) {
  let _options = _.defaults(options || {}, {enabled: false, delayInMs: 500});
  return (request, response, next) => {
    if (_options.enabled) {
      setTimeout(next, _options.delayInMs);
    } else {
      next();
    }
  };
}

module.exports = latencySimulatorMiddleware;
