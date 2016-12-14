'use strict';

const _ = require('lodash');

class Application {

  constructor(dependencies) {
    this.dependencies = dependencies;
    this._commandHandlers = [];
    this._queryHandlers = [];
    this._eventHandlers = [];
    this._projectionUpdaters = [];
    this._sagas = [];
    this._resources = [];
  }

  withCommandHandlers(handlers) {
    this._commandHandlers = this._commandHandlers.concat(handlers);
    return this;
  }

  withQueryHandlers(handlers) {
    this._queryHandlers = this._queryHandlers.concat(handlers);
    return this;
  }

  withEventHandlers(handlers) {
    this._eventHandlers = this._eventHandlers.concat(handlers);
    return this;
  }

  withProjectionUpdaters(updaters) {
    this._projectionUpdaters = this._projectionUpdaters.concat(updaters);
    return this;
  }

  withSagas(sagas) {
    this._sagas = this._sagas.concat(sagas);
    return this;
  }

  withResources(resources) {
    this._resources = this._resources.concat(resources);
    return this;
  }

  run() {
    _.forEach(this._commandHandlers, h => h.registerToBus(this.dependencies.commandBus));
    _.forEach(this._sagas, s => s.registerToBus(this.dependencies.eventBus));
    _.forEach(this._queryHandlers, h => h.registerToBus(this.dependencies.queryBus));
    _.forEach(this._eventHandlers, h => h.registerToBus(this.dependencies.eventBus));
    _.forEach(this._projectionUpdaters, u => u.registerToBus(this.dependencies.eventBus));
    _.forEach(this._resources, u => u.configure(this.dependencies.router));
  }
}

module.exports = Application;
