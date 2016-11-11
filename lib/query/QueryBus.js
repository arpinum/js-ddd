'use strict';

const {MessageBus} = require('../tools');

class QueryBus extends MessageBus {

  constructor(options) {
    super(Object.assign({}, options, {exclusiveHandlers: true}));
  }
}

module.exports = QueryBus;
