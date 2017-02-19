'use strict';

class FakeRequest {

  constructor() {
    this.query = {};
    this.body = {};
    this.params = {};
  }

  param(name) {
    return this.params[name];
  }

  withBody(body) {
    this.body = body;
    return this;
  }
}

module.exports = {FakeRequest};
