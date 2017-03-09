'use strict';

const _ = require('lodash');

function shrink(object) {
  return _.reduce(object, (result, value, key) => {
    if (value !== undefined) {
      if (! _.isDate(value) && _.isObject(value)) {
        result[key] = shrink(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }, {});
}

module.exports = {shrink};
