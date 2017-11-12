'use strict';

class StubMessageBus {
  constructor() {
    const sinon = require('sinon');
    this.broadcastAll = sinon.stub().returns(Promise.resolve());
    this.broadcast = sinon.stub().returns(Promise.resolve());
    this.register = sinon.stub();
  }
}

module.exports = StubMessageBus;
