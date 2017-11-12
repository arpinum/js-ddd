const t = require('tcomb');

const EventStoreContract = t.interface(
  {
    add: t.Function,
    addAll: t.Function,
    eventsFromAggregate: t.Function,
    eventsFromTypes: t.Function
  },
  { name: 'EventStoreContract' }
);

module.exports = EventStoreContract;
