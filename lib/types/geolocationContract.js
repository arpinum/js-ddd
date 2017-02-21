const t = require('tcomb');

const GeolocationContract = t.interface({
  latitude: t.Number,
  longitude: t.Number
}, {name: 'GeolocationContract'});

module.exports = GeolocationContract;
