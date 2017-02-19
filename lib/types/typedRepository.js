const t = require('tcomb');

const TypedRepository = t.interface({
  getById: t.Function,
  saveEvents: t.Function
}, {name: 'TypedRepository'});

module.exports = {TypedRepository};
