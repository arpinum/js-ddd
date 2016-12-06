'use strict';

const FunctionalError = require('./generic/FunctionalError');

class EntityFrozenError extends FunctionalError {

  constructor(id) {
    super(`Entity ${id} is frozen`);
  }
}

module.exports = EntityFrozenError;
