'use strict';

const t = require('tcomb');
const AggregateRoot = require('../aggregateRoot');
const catEventHandlers = require('./catEventHandlers');

const Creation = t.interface({
  id: t.String,
  age: t.Integer,
  name: t.maybe(t.String)
});

class Cat extends AggregateRoot {
  constructor(creation) {
    super(Creation(creation));
  }

  get handlers() {
    return catEventHandlers;
  }
}

module.exports = Cat;
