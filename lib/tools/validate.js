'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const {ValidationError} = require('../errors');

class Validator {

  constructor(object) {
    this._object = object;
  }

  isA(type) {
    let validation = t.validate(this._object, type);
    if (!validation.isValid()) {
      let errors = _.map(validation.errors, 'message');
      let error = new ValidationError('Validation failed, a reason is: ' + errors[0]);
      error.errors = errors;
      throw error;
    }
  }
}

function validate(object) {
  return new Validator(object);
}

module.exports = validate;
