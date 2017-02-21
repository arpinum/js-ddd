const t = require('tcomb');

const MessageHandlerContract = t.interface({
  handle: t.Function,
  messageName: t.String
}, {name: 'MessageHandlerContract'});

module.exports = MessageHandlerContract;
