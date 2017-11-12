'use strict';

class FakeResponse {
  constructor() {
    const sinon = require('sinon');

    this.send = sinon.stub().returnsThis();
    this.end = sinon.stub().returnsThis();
    this.status = sinon.stub().returnsThis();
    this.cookie = sinon.stub().returnsThis();
    this.clearCookie = sinon.stub().returnsThis();
  }
}

module.exports = FakeResponse;
