module.exports = Object.assign(
  require('./aggregateRootContract'),
  require('./eventStoreContract'),
  require('./geolocationContract'),
  require('./integerStringContract'),
  require('./iso8601DateStringContract'),
  require('./messageContract'),
  require('./messageBusContract'),
  require('./messageHandlerContract'),
  require('./projectionUpdaterContract'),
  require('./repositoryContract'),
  require('./timeContract'),
  require('./timeStringContract'),
  require('./verbHandlerContract')
);
