var stream = require('stream');
var util = require('util');

const END_OF_LINE = '\u000d\u000a'

module.exports = SSE;

util.inherits(SSE, stream.Transform);
function SSE () {
  if (!(this instanceof SSE)) return new SSE();
  stream.Transform.call(this);

  this._writableState.objectMode = true;

  this._transform = function (chunk, _, callback) {
    chunk = new Chunk(chunk);
    var frame = chunk.getComment() + chunk.getId() + chunk.getName() + chunk.getMessage() + END_OF_LINE;
    callback(null, frame);
  }
}
SSE.prototype.comment = function (text) {
  this.write(SSE.Comment(text));
  return this;
}
SSE.prototype.event = function (name, data) {
  this.write([].slice.call(arguments));
  return this;
}
SSE.prototype.pipe = function (dest, options) {
  if (dest.setHeader) {
    try {
      dest.setHeader('Content-Type', 'text/event-stream')
    } catch(e) {
      // well, we tried
    }
  }
  return stream.Transform.prototype.pipe.apply(this, arguments)
}

SSE.Chunk = Chunk;

function Chunk (stringOrArray) {
  var message, name, id, comment;
  if (stringOrArray instanceof SSE.Comment) {
    comment = String(stringOrArray);
  } else if (Array.isArray(stringOrArray)) {
    message = String(stringOrArray.pop());
    name = String(stringOrArray.pop() || '');
    id = String(stringOrArray.pop() || '');
  } else {
    message = String(stringOrArray);
  }

  this.getMessage = function () {
    if (!message) return '';
    return message.split(/\r\n|\r|\n/).map(function (msg) {
      return line('data', msg, true);
    }).join('');
  };

  this.getName = line.bind(null, 'event', name, true);
  this.getId = line.bind(null, 'id', id, true);
  this.getComment = line.bind(null, '', comment, false);

  function line (name, prop, linefeed) {
    return prop ? name + ': ' + prop + (linefeed ? END_OF_LINE : '') : '';
  }
}

SSE.Comment = Comment;
function Comment (content) {
  if (!(this instanceof Comment)) return new SSE.Comment(content);
  this.toString = content.toString.bind(content);
};

