var stream = require('stream');
var util = require('util');

module.exports = SSE;

util.inherits(SSE, stream.Transform);
function SSE () {
  if (!(this instanceof SSE)) return new SSE();
  stream.Transform.call(this);

  this._writableState.objectMode = true;

  this._transform = function (chunk, _, callback) {
    var message = '', name = '';
    if (Array.isArray(chunk) && chunk.length === 2) {
      name = 'event: ' + String(chunk[0]) + END_OF_LINE;
      message = 'data: ' + String(chunk[1]) + END_OF_LINE;
    } else {
      message = 'data: ' + String(chunk) + END_OF_LINE;
    }

    var frame = name + message + END_OF_LINE;
    callback(null, frame);
  }
}

const END_OF_LINE = '\u000d\u000a'
