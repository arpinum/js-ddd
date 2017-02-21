const t = require('tcomb');

const ProjectionUpdaterContract = t.interface({
  build: t.Function,
  registerToBus: t.Function
}, {name: 'ProjectionUpdaterContract'});

module.exports = {ProjectionUpdaterContract};
