'use strict';

const t = require('tcomb');
const {TypedAggregateRoot} = require('../types');
const {Message} = require('../tools');

function Factory(creation) {
  let {handlers} = creation;
  let instance = Object.assign({}, creation, {
    createEvent,
    applyEvent
  });
  return instance;

  function createEvent(message) {
    let aggregatePart = {aggregate: {id: instance.id, type: instance.aggregateName}};
    return Message(Object.assign({}, message, aggregatePart));
  }

  function applyEvent(event) {
    let handler = handlers[event.type] || (() => instance);
    return handler(event, instance);
  }
}

const Creation = t.interface({
  id: t.String,
  aggregateName: t.String,
  handlers: t.Object
});

module.exports = t.func(Creation, TypedAggregateRoot).of(Factory);