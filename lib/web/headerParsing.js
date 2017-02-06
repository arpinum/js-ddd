'use strict';

const _ = require('lodash');

function get(headers, name) {
  if (!name) {
    return null;
  }
  return _.find(headers, (value, key) => {
    return key.toLowerCase() === name.toLowerCase();
  });
}

module.exports = {
  get
};
