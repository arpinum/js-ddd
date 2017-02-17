const t = require('tcomb');

const timeRegex = /^\d{2}(:\d{2}(:\d{2})?)?$/;

const TypedTimeString = t.refinement(t.String, s => timeRegex.test(s));

module.exports = TypedTimeString;
