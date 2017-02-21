const t = require('tcomb');

const RepositoryContract = t.interface({
  getById: t.Function,
  saveEvents: t.Function
}, {name: 'RepositoryContract'});

module.exports = RepositoryContract;
