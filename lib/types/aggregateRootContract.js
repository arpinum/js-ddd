const t = require('tcomb');

const AggregateRootContract = t.interface({
  id: t.String,
  aggregateName: t.String
}, {name: 'AggregateRootContract'});

module.exports = {AggregateRootContract};
