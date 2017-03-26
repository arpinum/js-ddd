'use strict';

const t = require('tcomb');
const Cat = require('./cat');
const {EventStoreContract, MessageBusContract} = require('../../types');
const Repository = require('../repository');

const Creation = t.interface({
  eventStore: EventStoreContract,
  eventBus: MessageBusContract
}, {strict: true});

class CatRepository extends Repository {
  constructor(creation) {
    super(parentCreation());

    function parentCreation() {
      let {eventStore, eventBus} = Creation(creation);
      return {
        eventStore,
        eventBus,
        AggregateRootType: Cat,
        options: {
          beforeEventApplication: [stringToBirthDate],
          beforeEventSave: [birthDateToString]
        }
      };
    }
  }
}

function stringToBirthDate(event) {
  if (event.payload.birthDate) {
    return event.updatePayload({birthDate: new Date(event.payload.birthDate)});
  }
  return event;
}

function birthDateToString(event) {
  if (event.payload.birthDate) {
    return event.updatePayload({birthDate: event.payload.birthDate.toISOString()});
  }
  return event;
}

module.exports = CatRepository;
