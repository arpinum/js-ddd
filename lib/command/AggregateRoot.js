'use strict';

const _ = require('lodash');
const t = require('tcomb');
const Event = require('./event/Event');

const Creation = t.interface({
  id: t.String,
  aggregateName: t.String,
  handlers: t.Object
});

const AggregateRoot = t.interface({
  id: t.String,
  aggregateName: t.String
});

function Factory(creation) {
  let {handlers} = creation;
  let instance = Object.assign({}, creation, {
    createEvent,
    applyEvent
  });
  return instance;

  function createEvent(eventOrType, payloadMaybe) {
    return eventFrom(eventOrType, payloadMaybe)
      .concerningAggregate(instance.id, instance.aggregateName);

    function eventFrom(eventOrType, payloadMaybe) {
      if (_.isObject(eventOrType)) {
        return eventOrType;
      }
      return new Event(eventOrType, payloadMaybe);
    }
  }

  function applyEvent(event) {
    let handler = handlers[event.type] || (() => instance);
    return handler(event, instance);
  }
}

module.exports = t.func(Creation, AggregateRoot).of(Factory);
