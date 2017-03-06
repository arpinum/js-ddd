'use strict';

const {MessageBus} = require('../tools');

class QueryBus extends MessageBus {

  constructor(creation = {}) {
    super(Object.assign({}, {exclusiveHandlers: true}, creation));
  }
}

module.exports = QueryBus;
