'use strict';

const {MessageBus} = require('../tools');

class CommandBus extends MessageBus {

  constructor(options) {
    super(Object.assign({}, options, {exclusiveListeners: true}));
  }
}

module.exports = CommandBus;
