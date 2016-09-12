'use strict';

const _ = require('lodash');

const methods = ['get', 'post', 'put', 'patch', 'delete', 'all'];

class FakeRouter {

  constructor() {
    this._routes = new Map();
    for (let method of methods) {
      this._createRouteMethod(method);
      this._createCallMethod(method);
    }
  }

  _createRouteMethod(method) {
    this[method] = (url, callback) => this._route(url, method, callback);
  }

  _route(url, method, callback) {
    if (!this._routes.has(url)) {
      this._routes.set(url, new Map());
    }
    let route = this._routes.get(url);
    route.set(method, callback);
  }

  _createCallMethod(method) {
    this['do' + _.upperFirst(method)] = (url, request, response) => {
      if (!this._routes.has(url)) {
        return Promise.reject(new Error('No route for url ' + url));
      }
      let route = this._routes.get(url);
      if (!route.has(method)) {
        return Promise.reject(new Error('No method ' + method));
      }
      let callback = route.get(method);
      return callback(request, response);
    };
  }
}

module.exports = FakeRouter;
