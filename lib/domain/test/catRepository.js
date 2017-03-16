'use strict';

const t = require('tcomb');
const Cat = require('./cat');
const {EventStoreContract, MessageBusContract} = require('../../types');
const Repository = require('../repository');

const Creation = t.interface({
  eventStore: EventStoreContract,
  eventBus: MessageBusContract
}, {strict: true});

const eventConverters = [
  convertBirthDate
];

function convertBirthDate(event) {
  if (event.payload.birthDate) {
    return event.updatePayload({birthDate: new Date(event.payload.birthDate)});
  }
  return event;
}

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
          eventConverters
        }
      };
    }
  }
}

module.exports = CatRepository;
