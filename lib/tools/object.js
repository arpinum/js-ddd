'use strict';

const _ = require('lodash');

function shrink(object) {
  return _.reduce(object, (result, value, key) => {
    if (value !== undefined) {
      if (isObjectLike(value)) {
        result[key] = shrink(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }, {});

  function isObjectLike(value) {
    return _.isObject(value) &&
      !_.isDate(value) &&
      !_.isArray(value) &&
      !_.isRegExp(value) &&
      !_.isFunction(value);
  }
}

module.exports = {shrink};
