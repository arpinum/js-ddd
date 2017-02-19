'use strict';

const {FunctionalError} = require('./generic/functionalError');

class QueriedObjectNotFoundError extends FunctionalError {

  constructor(criteria) {
    super('Queried object not found for ' + JSON.stringify(criteria));
  }
}

module.exports = {QueriedObjectNotFoundError};
