'use strict';

const _ = require('lodash');
const {ClientError} = require('../../errors');
const {promising} = require('../../tools');

class AggregateRootResource {

  constructor(repositories) {
    this._repositories = repositories;
  }

  configure(router, url) {
    router.get(url, (request, response) => this._get(request, response));
  }

  _get(request, response) {
    let self = this;
    let rootType = request.params.type;
    return promising.try(() => {
      let repository = findRepository();
      if (!repository) {
        throw new ClientError(`Repository for type ${rootType} cannot be found!`);
      }
      return repository.getById(request.params.id).then(aggregateRoot => {
        response.send(aggregateRoot);
      });
    });

    function findRepository() {
      return _.find(self._repositories, r => r.AggregateType.name === rootType);
    }
  }
}

module.exports = AggregateRootResource;
