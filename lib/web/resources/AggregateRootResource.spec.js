'use strict';

const sinon = require('sinon');
const {FakeRouter, FakeResponse} = require('../../test');
const AggregateRootResource = require('./AggregateRootResource');

describe('Aggregate root resource', () => {

  let repositories;
  let router;
  let resource;

  beforeEach(() => {
    repositories = {};
    router = new FakeRouter();
    resource = new AggregateRootResource(repositories);
    resource.configure(router, '/url');
  });

  context('on GET', () => {
    it('should get aggregate root by id using the repository for the given type', () => {
      repositories.userRepository = {getById: sinon.stub()};
      repositories.userRepository.getById.withArgs('the_id').resolves({id: 'the_id'});
      let request = {params: {id: 'the_id', type: 'User'}};
      let response = new FakeResponse();

      let get = router.doGet('/url', request, response);

      return get.then(() => {
        response.send.should.have.been.calledWith({id: 'the_id'});
      });
    });

    it('should use a custom repository name resolver', () => {
      repositories.repositoryForUser = {getById: sinon.stub()};
      repositories.repositoryForUser.getById.withArgs('the_id').resolves({id: 'the_id'});
      let request = {params: {id: 'the_id', type: 'User'}};
      let response = new FakeResponse();
      let resource = new AggregateRootResource(repositories,
        {repositoryNameResolver: type => `repositoryFor${type}`});
      resource.configure(router, '/url');

      let get = router.doGet('/url', request, response);

      return get.then(() => {
        response.send.should.have.been.calledWith({id: 'the_id'});
      });
    });
  });
});
