const t = require('tcomb');

const TypedLogger = t.interface({
  all: t.Function,
  trace: t.Function,
  debug: t.Function,
  info: t.Function,
  warn: t.Function,
  error: t.Function,
  off: t.Function
});

module.exports = TypedLogger;
