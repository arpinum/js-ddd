'use strict';

const _ = require('lodash');
const {promising, stream} = require('../tools');

function MemoryEventStore() {
  let events = [];
  let currentId = 0;

  return {
    events,
    add,
    addAll,
    eventsFromAggregate,
    eventsFromTypes,
    allEventsFromTypes
  };

  function add(event) {
    return promising.try(() => {
      events.push(Object.assign({}, event, {id: generateId()}));
    });
  }

  function generateId() {
    let id = currentId;
    currentId++;
    return id;
  }

  function addAll(events) {
    return promising.try(() => {
      for (let event of events) {
        add(event);
      }
    });
  }

  function eventsFromAggregate(id, type) {
    let results = _.filter(
      events,
      e => _.get(e, 'aggregate.id') === id && _.get(e, 'aggregate.type') === type);
    return stream.createArrayStream(results);
  }

  function eventsFromTypes(types, newerThanThisEventId) {
    let results = allEventsFromTypes(types, newerThanThisEventId);
    return stream.createArrayStream(results);
  }

  function allEventsFromTypes(types, newerThanThisEventId) {
    return _.filter(events, e => {
      let valid = _.includes(types, e.type);
      if (!_.isNil(newerThanThisEventId)) {
        valid = valid && e.id > newerThanThisEventId;
      }
      return valid;
    });
  }
}

module.exports = MemoryEventStore;
