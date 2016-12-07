module.exports = {
  EntityNotFoundError: require('./EntityNotFoundError'),
  QueriedObjectNotFoundError: require('./QueriedObjectNotFoundError'),
  ValidationError: require('./ValidationError'),
  FunctionalError: require('./generic/FunctionalError'),
  TechnicalError: require('./generic/TechnicalError'),
  ClientError: require('./web/ClientError'),
  ResourceNotFoundError: require('./web/ResourceNotFoundError'),
  ServerError: require('./web/ServerError'),
  UnauthorizedError: require('./web/UnauthorizedError'),
  WebError: require('./web/WebError')
};
