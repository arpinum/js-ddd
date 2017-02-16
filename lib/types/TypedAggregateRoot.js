const t = require('tcomb');

const TypedAggregateRoot = t.interface({
  id: t.String,
  aggregateName: t.String
});

module.exports = TypedAggregateRoot;
