'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const FunctionalError = require('../errors').FunctionalError;

class Validator {

  constructor(object) {
    this._object = object;
  }

  isA(type) {
    this._validate(type);
  }

  isStrictlyA(type) {
    this._validate(type, {strict: true});
  }

  _validate(type, options) {
    let validation = t.validate(this._object, type, options);
    if (!validation.isValid()) {
      let errors = _.map(validation.errors, 'message');
      let error = new FunctionalError('Validation failed, a reason is: ' + errors[0]);
      error.errors = errors;
      throw error;
    }
  }
}

function validate(object) {
  return new Validator(object);
}

module.exports = validate;
