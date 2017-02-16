const t = require('tcomb');

const TypedProjectionUpdater = t.interface({
  build: t.Function,
  registerToBus: t.Function
});

module.exports = TypedProjectionUpdater;
