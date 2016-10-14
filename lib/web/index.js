module.exports = {
  HeadersParser: require('./HeadersParser'),
  latencySimulatorMiddleware: require('./middlewares/latencySimulatorMiddleware'),
  limitFieldsMiddleware: require('./middlewares/limitFieldsMiddleware'),
  prettyMiddleware: require('./middlewares/prettyMiddleware'),
  unhandledErrorMiddleware: require('./middlewares/unhandledErrorMiddleware'),
  objectToHtml: require('./objectToHtml'),
  AggregateRootResource: require('./resources/AggregateRootResource')
};
