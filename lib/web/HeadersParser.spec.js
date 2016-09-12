'use strict';

const should = require('chai').should();
const HeadersParser = require('./HeadersParser');

describe('The headers parser', () => {

  it('should get specific header', () => {
    let headersParser = new HeadersParser({header: 'value'});

    headersParser.get('header').should.equal('value');
  });

  it('should get null if no specific header', () => {
    let headersParser = new HeadersParser({header: 'value'});

    should.not.exist(headersParser.get());
  });

  it('should get null if header cannot be found', () => {
    let headersParser = new HeadersParser({header: 'value'});

    should.not.exist(headersParser.get('unknown'));
  });

  it('should get null if there are no headers', () => {
    let headersParser = new HeadersParser(null);

    should.not.exist(headersParser.get('unknown'));
  });

  it('should get specific header without case sensitivity', () => {
    let headersParser = new HeadersParser({'x-header': 'value'});

    headersParser.get('X-Header').should.equal('value');
  });
});
