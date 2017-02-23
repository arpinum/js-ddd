'use strict';

const t = require('tcomb');
const {Event} = require('../tools');

const Creation = t.interface({
  id: t.String
});

class AggregateRoot {

  constructor(creation) {
    Object.assign(this, Creation(creation));
  }

  get aggregateName() {
    return this.constructor.name;
  }

  get handlers() {
    return {};
  }

  updateWith(update) {
    let creation = Object.assign({}, this, update);
    return new this.constructor(creation);
  }

  createEvent(message) {
    let aggregatePart = {aggregate: {id: this.id, type: this.aggregateName}};
    return new Event(Object.assign({}, message, aggregatePart));
  }

  applyEvent(event) {
    let handler = this.handlers[event.type] || (() => this);
    return handler(event, this);
  }
}

module.exports = AggregateRoot;
