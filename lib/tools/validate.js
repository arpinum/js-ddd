'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const {ValidationError} = require('../errors');

function validate(object) {
  return {
    isA
  };

  function isA(type) {
    let validation = t.validate(object, type);
    if (!validation.isValid()) {
      let errors = _.map(validation.errors, 'message');
      let error = new ValidationError('Validation failed, a reason is: ' + errors[0]);
      error.errors = errors;
      throw error;
    }
  }
}

module.exports = {validate};
