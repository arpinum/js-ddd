'use strict';

const _ = require('lodash');

class FakeApplication {

  constructor() {
    this.middlewares = [];
    this.allArguments = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  all() {
    this.allArguments = _.toArray(arguments);
  }
}

module.exports = FakeApplication;
