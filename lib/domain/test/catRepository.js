'use strict';

const t = require('tcomb');
const Cat = require('./cat');
const {EventStoreContract} = require('../../types');
const Repository = require('../repository');

const Creation = t.interface({
  eventStore: EventStoreContract,
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
    return event.updatePayload({birthDate: new Date(event.payload.birthDate)});
  }
  return event;
}

module.exports = CatRepository;
