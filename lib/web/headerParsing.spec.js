'use strict';

const should = require('chai').should();
const headerParsing = require('./headerParsing');

describe('Header parsing', () => {

  it('should get specific header', () => {
    headerParsing.get({header: 'value'}, 'header').should.equal('value');
  });

  it('should get null if no specific header', () => {
    should.not.exist(headerParsing.get({header: 'value'}));
  });

  it('should get null if header cannot be found', () => {
    should.not.exist(headerParsing.get({header: 'value'}, 'unknown'));
  });

  it('should get null if there are no headers', () => {
    should.not.exist(headerParsing.get(null, 'unknown'));
  });

  it('should get specific header without case sensitivity', () => {
    headerParsing.get({'x-header': 'value'}, 'X-Header').should.equal('value');
  });
});
