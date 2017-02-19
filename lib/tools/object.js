'use strict';

const _ = require('lodash');

function assignPrivately(object, properties) {
  let objectProperties = _.reduce(
    properties,
    (result, value, key) => Object.assign(result, {[key]: {value}}),
    {});
  return Object.defineProperties(object, objectProperties);
}

module.exports = {
  assignPrivately
};
