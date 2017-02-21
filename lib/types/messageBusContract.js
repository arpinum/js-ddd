const t = require('tcomb');

const MessageBusContract = t.interface({
  broadcastAll: t.Function,
  broadcast: t.Function,
  register: t.Function
}, {name: 'MessageBusContract'});

module.exports = {MessageBusContract};
