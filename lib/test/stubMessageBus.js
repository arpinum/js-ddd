'use strict';

class StubMessageBus {

  constructor() {
    const sinon = require('sinon');
    this.broadcastAll = sinon.stub();
    this.broadcast = sinon.stub();
    this.register = sinon.stub();
  }
}

module.exports = StubMessageBus;
