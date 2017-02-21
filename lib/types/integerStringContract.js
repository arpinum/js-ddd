const t = require('tcomb');

const integerRegex = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;

const IntegerStringContract = t.refinement(t.String, s => integerRegex.test(s), 'IntegerStringContract');

module.exports = {IntegerStringContract};
