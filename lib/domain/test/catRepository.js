'use strict';

const t = require('tcomb');
const {withPayload} = require('@arpinum/messaging');
const Cat = require('./cat');
const {EventStoreContract} = require('../../types');
const Repository = require('../repository');

const Creation = t.interface({
  eventStore: EventStoreContract
}, {strict: true});

class CatRepository extends Repository {
  constructor(creation) {
    super(parentCreation());

    function parentCreation() {
      let {eventStore} = Creation(creation);
      return {
        eventStore,
        AggregateRootType: Cat,
        options: {
          beforeEventApplication: [stringToBirthDate]
        }
      };
    }
  }
}

function stringToBirthDate(event) {
  if (event.payload.birthDate) {
    return withPayload(e => ({birthDate: new Date(e.payload.birthDate)}), event);
  }
  return event;
}

module.exports = CatRepository;
