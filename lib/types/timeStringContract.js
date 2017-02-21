const t = require('tcomb');

const timeRegex = /^\d{2}(:\d{2}(:\d{2})?)?$/;

const TimeStringContract = t.refinement(t.String, s => timeRegex.test(s), 'TimeStringContract');

module.exports = {TimeStringContract};
