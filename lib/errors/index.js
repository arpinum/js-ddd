module.exports = Object.assign(
  require('./entityNotFoundError'),
  require('./queriedObjectNotFoundError'),
  require('./validationError'),
  require('./generic/functionalError'),
  require('./generic/technicalError'),
  require('./web/clientError'),
  require('./web/resourceNotFoundError'),
  require('./web/serverError'),
  require('./web/unauthorizedError'),
  require('./web/webError')
);
