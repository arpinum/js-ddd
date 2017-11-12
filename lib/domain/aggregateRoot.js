'use strict';

const t = require('tcomb');

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
    const creation = Object.assign({}, this, update);
    return new this.constructor(creation);
  }

  createEvent(message) {
    const aggregatePart = {
      aggregate: { id: this.id, type: this.aggregateName }
    };
    const datePart = { date: new Date() };
    return Object.assign({}, message, datePart, aggregatePart);
  }

  applyEvent(event) {
    const handler = this.handlers[event.type] || (() => this);
    return handler(event, this);
  }

  static bootstrap(creation) {
    const { type, id } = creation;
    const root = Object.create(type.prototype, {
      id: { value: id, enumerable: true }
    });
    return root;
  }
}

module.exports = AggregateRoot;
