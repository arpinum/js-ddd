const t = require('tcomb');

const TypedTime = t.interface({
  hours: t.Integer,
  minutes: t.Integer,
  seconds: t.Integer,
  asHours: t.Function,
  asMinutes: t.Function,
  asSeconds: t.Function,
  asString: t.Function
}, {name: 'TypedTime'});

module.exports = TypedTime;
