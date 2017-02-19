'use strict';

const {FunctionalError} = require('./generic/functionalError');

class EntityNotFoundError extends FunctionalError {

  constructor(criteria) {
    super('No entity for ' + JSON.stringify(criteria));
  }
}

module.exports = {EntityNotFoundError};
