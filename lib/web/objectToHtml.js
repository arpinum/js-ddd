'use strict';

function objectToHtml(object) {
  return JSON.stringify(object, null, '\t')
    .replace(/\n/g, '<br />')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;');
}

module.exports = {objectToHtml};
