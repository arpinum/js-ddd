const t = require('tcomb');
const {contracts: messagingContracts} = require('@arpinum/messaging');

module.exports = Object.assign({
  AggregateRootContract: require('./aggregateRootContract'),
  EventStoreContract: require('./eventStoreContract'),
  MessageHandlerContract: require('./messageHandlerContract'),
  ProjectionUpdaterContract: require('./projectionUpdaterContract'),
  RepositoryContract: require('./repositoryContract'),
  VerbHandlerContract: require('./verbHandlerContract')
}, messagingContracts(t));
