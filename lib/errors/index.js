module.exports = {
  AuthorizationError: require('./authorizationError'),
  EntityNotFoundError: require('./entityNotFoundError'),
  QueriedObjectNotFoundError: require('./queriedObjectNotFoundError'),
  ValidationError: require('./validationError'),
  FunctionalError: require('./generic/functionalError'),
  TechnicalError: require('./generic/technicalError'),
  ClientError: require('./web/clientError'),
  ForbiddenError: require('./web/forbiddenError'),
  ResourceNotFoundError: require('./web/resourceNotFoundError'),
  ServerError: require('./web/serverError'),
  UnauthorizedError: require('./web/unauthorizedError'),
  WebError: require('./web/webError')
};
