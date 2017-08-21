'use strict';

const _ = require('lodash');
const {wrap} = require('@arpinum/promising');
const {stream} = require('../tools');

class MemoryEventStore {

  constructor() {
    this.events = [];
  }

  add(event) {
    let self = this;
    return wrap(() => {
      this.events.push(Object.assign({}, event, {id: generateId()}));
    })();

    function generateId() {
      return self.events.length;
    }
  }

  addAll(events) {
    return wrap(() => events.forEach(event => this.add(event)))();
  }

  eventsFromAggregate(id, type) {
    let results = _.filter(
      this.events,
      e => _.get(e, 'aggregate.id') === id && _.get(e, 'aggregate.type') === type);
    return stream.createArrayStream(results);
  }

  eventsFromTypes(types, newerThanThisEventId) {
    let results = this.allEventsFromTypes(types, newerThanThisEventId);
    return stream.createArrayStream(results);
  }

  allEventsFromTypes(types, newerThanThisEventId) {
    return _.filter(this.events, e => {
      let valid = _.includes(types, e.type);
      if (!_.isNil(newerThanThisEventId)) {
        valid = valid && e.id > newerThanThisEventId;
      }
      return valid;
    });
  }
}

module.exports = MemoryEventStore;
