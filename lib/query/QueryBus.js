'use strict';

const {MessageBus} = require('../messaging');

class QueryBus extends MessageBus {

  constructor(options) {
    super(Object.assign({}, options, {exclusiveListeners: true}));
  }
}

module.exports = QueryBus;
