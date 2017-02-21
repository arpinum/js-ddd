const t = require('tcomb');

const MessageContract = t.interface({
  type: t.String,
  payload: t.Object
}, {name: 'MessageContract'});

module.exports = {MessageContract};
