const t = require('tcomb');

const MessageContract = t.interface({
  type: t.String,
  payload: t.Object,
  updatePayload: t.Function
}, {name: 'MessageContract'});

module.exports = MessageContract;
