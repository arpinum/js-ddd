'use strict';

const {MessageBus} = require('../tools');

class QueryBus extends MessageBus {

  constructor(options = {}) {
    super({options: Object.assign({}, {exclusiveHandlers: true}, options)});
  }
}

module.exports = {QueryBus};
