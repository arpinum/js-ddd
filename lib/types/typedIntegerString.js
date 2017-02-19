const t = require('tcomb');

const integerRegex = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;

const TypedIntegerString = t.refinement(t.String, s => integerRegex.test(s), 'TypedIntegerString');

module.exports = {TypedIntegerString};
