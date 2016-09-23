'use strict';

const _ = require('lodash');
const {FunctionalError} = require('../errors');

class Converter {

  constructor(object, propertyName) {
    this._object = object;
    this._propertyName = propertyName;
  }

  toDate() {
    let convert = rawProperty => {
      let parsing = Date.parse(rawProperty);
      if (isNaN(parsing)) {
        return {
          success: false,
          invalidType: 'date'
        };
      }
      return {
        success: true,
        value: new Date(parsing)
      };
    };
    return this._convert(convert);
  }

  toInteger() {
    let convert = rawProperty => {
      let parsing = Number.parseInt(rawProperty);
      if (Number.isNaN(parsing)) {
        return {
          success: false,
          invalidType: 'integer'
        };
      }
      return {
        success: true,
        value: parsing
      };
    };
    return this._convert(convert);
  }

  _convert(convert) {
    let clone = _.clone(this._object);
    let rawProperty = _.get(clone, this._propertyName);
    if (rawProperty === undefined) {
      return clone;
    }
    let conversion = convert(rawProperty);
    if (!conversion.success) {
      throw new FunctionalError(`The property ${this._propertyName} is not a valid ${conversion.invalidType}`);
    }
    _.set(clone, this._propertyName, conversion.value);
    return clone;
  }
}

class Sanitize {

  constructor(object) {
    this._object = object;
  }

  convert(propertyName) {
    return new Converter(this._object, propertyName);
  }
}

function sanitize(object) {
  return new Sanitize(object);
}

module.exports = sanitize;
