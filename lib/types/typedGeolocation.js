const t = require('tcomb');

const TypedGeolocation = t.interface({
  latitude: t.Number,
  longitude: t.Number
}, {name: 'TypedGeolocation'});

module.exports = {TypedGeolocation};
