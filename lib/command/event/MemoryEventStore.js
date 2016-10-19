'use strict';

const _ = require('lodash');
const {promising, stream} = require('../../tools');

class MemoryEventStore {

  constructor() {
    this.events = [];
    this._currentId = 0;
  }

  add(event) {
    return promising.try(() => {
      this.events.push(Object.assign({}, event, {id: this._generateId()}));
    });
  }

  _generateId() {
    let id = this._currentId;
    this._currentId++;
    return id;
  }

  addAll(events) {
    return promising.try(() => {
      for (let event of events) {
        this.add(event);
      }
    });
  }

  eventsFromAggregate(id, type) {
    let events = _.filter(
      this.events,
      e => _.get(e, 'aggregate.id') === id && _.get(e, 'aggregate.type') === type);
    return stream.createArrayStream(events);
  }

  eventsFromTypes(types, newerThanThisEventId) {
    let events = this.allEventsFromTypes(types, newerThanThisEventId);
    return stream.createArrayStream(events);
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
