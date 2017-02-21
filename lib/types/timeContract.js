const t = require('tcomb');

const TimeContract = t.interface({
  hours: t.Integer,
  minutes: t.Integer,
  seconds: t.Integer,
  asHours: t.Function,
  asMinutes: t.Function,
  asSeconds: t.Function,
  asString: t.Function
}, {name: 'TimeContract'});

module.exports = TimeContract;
