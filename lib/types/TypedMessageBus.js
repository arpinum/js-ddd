const t = require('tcomb');

const TypedMessageBus = t.interface({
  broadcastAll: t.Function,
  broadcast: t.Function,
  register: t.Function
}, {name: 'TypedMessageBus'});

module.exports = TypedMessageBus;
