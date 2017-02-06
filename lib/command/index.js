module.exports = {
  AggregateRoot: require('./AggregateRoot'),
  Event: require('./../command/event/Event'),
  MemoryEventStore: require('./../command/event/MemoryEventStore'),
  createRepository: require('./event/createRepository')
};
