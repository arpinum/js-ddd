const t = require('tcomb');

const VerbHandlerContract = t.interface({
  handle: t.Function
}, {name: 'VerbHandlerContract'});

module.exports = {VerbHandlerContract};
