'use strict';

const _ = require('lodash');
const path = require('path');
const winston = require('winston');

class LoggerFactory {

  constructor(options) {
    this._options = this._parseOptions(options);
  }

  _parseOptions(options) {
    return _.defaults(options || {}, {
      level: process.env.ENGINE__LOG_LEVEL || 'info'
    });
  }

  create(fileName) {
    let loggerOptions = {
      level: this._options.level,
      transports: [
        new winston.transports.Console({
          timestamp: true,
          label: path.basename(fileName, path.extname(fileName))
        })
      ]
    };
    return new winston.Logger(loggerOptions);
  }
}

module.exports = LoggerFactory;
