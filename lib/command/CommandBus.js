'use strict';

const {MessageBus} = require('../tools');

class CommandBus extends MessageBus {

  constructor(options) {
    super(Object.assign({}, options, {exclusiveHandlers: true}));
  }
}

module.exports = CommandBus;
