'use strict';

const FunctionalError = require('./generic/FunctionalError');

class QueriedObjectNotFoundError extends FunctionalError {

  constructor(criteria) {
    super('Queried object not found for ' + JSON.stringify(criteria));
  }
}

module.exports = QueriedObjectNotFoundError;
