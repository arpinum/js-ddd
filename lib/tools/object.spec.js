'use strict';

const { shrink } = require('./object');

describe('object module', () => {
  context('when shrinking', () => {
    it('should remove undefined properties', () => {
      let object = { a: undefined };

      shrink(object).should.deep.equal({});
    });

    it('should remove nested undefined properties', () => {
      let object = { a: { b: { c: undefined } } };

      shrink(object).should.deep.equal({ a: { b: {} } });
    });

    it('should keep defined properties', () => {
      let object = { a: null, b: '', c: {}, d: Number.NaN };

      shrink(object).should.deep.equal({
        a: null,
        b: '',
        c: {},
        d: Number.NaN
      });
    });

    it('should handle both defined and undefined properties', () => {
      let object = { a: undefined, b: 'hello' };

      shrink(object).should.deep.equal({ b: 'hello' });
    });

    it('wont alter inputs', () => {
      let object = { a: undefined };

      let result = shrink(object);

      result.should.not.equal(object);
      Object.keys(object).should.include('a');
    });

    it('should preserve date objects', () => {
      let date = new Date();
      let object = { a: date };

      shrink(object).should.deep.equal({ a: date });
    });

    it('should preserve arrays', () => {
      let array = ['home'];
      let object = { a: array };

      shrink(object).should.deep.equal({ a: array });
    });

    it('should preserve regexp', () => {
      let regexp = /.*/;
      let object = { a: regexp };

      shrink(object).should.deep.equal({ a: regexp });
    });

    it('should preserve function', () => {
      let func = () => 'ok';
      let object = { a: func };

      shrink(object)
        .a()
        .should.equal('ok');
    });
  });
});
