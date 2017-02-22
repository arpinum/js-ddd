'use strict';

const {MessageBus} = require('../tools');

class CommandBus extends MessageBus {

  constructor(options = {}) {
    super({options: Object.assign({}, {exclusiveHandlers: true}, options)});
  }
}

module.exports = CommandBus;
