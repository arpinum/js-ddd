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

  class User {

  }

  context('on GET', () => {
    it('should get aggregate root by id using the repository for the given type', () => {
      repositories.userRepository = {
        getById: sinon.stub(),
        AggregateType: User
      };
      repositories.userRepository.getById.withArgs('the_id').resolves({id: 'the_id'});
      let request = {params: {id: 'the_id', type: 'User'}};
      let response = new FakeResponse();

      let get = router.doGet('/url', request, response);

      return get.then(() => {
        response.send.should.have.been.calledWith({id: 'the_id'});
      });
    });
  });
});
