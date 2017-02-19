module.exports = Object.assign(
  require('./headerParsing'),
  require('./middlewares/latencySimulatorMiddleware'),
  require('./middlewares/limitFieldsMiddleware'),
  require('./middlewares/prettyMiddleware'),
  require('./middlewares/unhandledErrorMiddleware'),
  require('./objectToHtml')
);
