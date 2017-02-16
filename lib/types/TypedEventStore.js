const t = require('tcomb');

const TypedEventStore = t.interface({
  add: t.Function,
  addAll: t.Function,
  eventsFromAggregate: t.Function,
  eventsFromTypes: t.Function
});

module.exports = TypedEventStore;
