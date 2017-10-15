'use strict';

var through2 = require('through2');
var get = require('lodash.get');

var ZERO_BYTE_STRING = '';

function ctor(options, propPath, defaultValue) {
  if (typeof options !== 'object') {
    defaultValue = propPath;
    propPath = options;
    options = {};
  }
  options = Object.assign({objectMode: true, highWaterMark: 16, excludeZBS: true}, options)

  var Get = through2.ctor(options, function (chunk, encoding, cb) {
    var out = get(chunk, propPath, defaultValue);

    // Pushing a zero-byte string in object mode will end the reading process.
    // In most instances this behviour is not desired.
    // https://nodejs.org/api/stream.html#stream_stream_push
    if (options.excludeZBS && out === ZERO_BYTE_STRING) return cb();

    this.push(out);
    return cb();
  });
  return Get;
}

function make(options, propPath, defaultValue) {
  return ctor(options, propPath, defaultValue)();
}

module.exports = make;
module.exports.ctor = ctor;
