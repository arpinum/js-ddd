const t = require('tcomb');

const TypedMessage = t.interface({
  type: t.String,
  payload: t.Object
}, {name: 'TypedMessage'});

module.exports = {TypedMessage};
