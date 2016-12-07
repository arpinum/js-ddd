'use strict';

const _ = require('lodash');
const {ClientError} = require('../../errors');
const {promising} = require('../../tools');

class AggregateRootResource {

  constructor(repositories, options) {
    this._options = _.defaults({}, options, {
      repositoryNameResolver: type => `${_.lowerFirst(type)}Repository`
    });
    this._repositories = repositories;
  }

  configure(router, url) {
    router.get(url, (request, response) => this._get(request, response));
  }

  _get(request, response) {
    return promising.try(() => {
      let repositoryName = this._options.repositoryNameResolver(request.params.type);
      let repository = this._repositories[repositoryName];
      if (!repository) {
        throw new ClientError(`Repository ${repositoryName} cannot be found!`);
      }
      return repository.getById(request.params.id).then(aggregateRoot => {
        response.send(aggregateRoot);
      });
    });
  }
}

module.exports = AggregateRootResource;
