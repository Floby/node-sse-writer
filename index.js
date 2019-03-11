var stream = require('stream');
var ms = require('ms')
var util = require('util');
var stringify = require('json-stringify-safe')

var END_OF_LINE = '\u000d\u000a'

module.exports = SSE;

util.inherits(SSE, stream.Transform);
function SSE () {
  if (!(this instanceof SSE)) return new SSE();
  stream.Transform.call(this);

  this._writableState.objectMode = true;

  this._transform = function (chunk, _, callback) {
    chunk = new Chunk(chunk);
    var frame = chunk.getComment()
      + chunk.getRetry()
      + chunk.getId()
      + chunk.getName()
      + chunk.getMessage()
      + END_OF_LINE;
    callback(null, frame);
  }
}
SSE.prototype.comment = function (text) {
  this.write(SSE.Comment(text));
  return this;
}
SSE.prototype.retry = function (delay) {
  this.write(SSE.Retry(delay));
  return this;
}
SSE.prototype.event = function (params) {
  var args;
  if (looksLikeEventObject(params)) {
    args = [params.id, params.name, params.data]
  } else {
    args = [].slice.call(arguments)
  }
  this.write(args)
  return this;
}
function looksLikeEventObject (object) {
  return typeof object === 'object' && object.hasOwnProperty('data')
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

function Chunk (stringOrArrayOrObject) {
  var message, name, id, comment, retry;
  if (stringOrArrayOrObject instanceof SSE.Comment) {
    comment = String(stringOrArrayOrObject);
  } else if (stringOrArrayOrObject instanceof SSE.Retry) {
    retry = stringOrArrayOrObject.milliseconds
  } else if (Array.isArray(stringOrArrayOrObject)) {
    message = stringOrArrayOrObject.pop();
    name = String(stringOrArrayOrObject.pop() || '');
    id = String(stringOrArrayOrObject.pop() || '');
  } else {
    message = stringOrArrayOrObject;
  }
  if (message && typeof message === 'object') {
    message = stringify(message)
  } else if (message) {
    message = String(message)
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
  this.getRetry = line.bind(null, 'retry', retry, true);

  function line (name, prop, linefeed) {
    return prop ? name + ': ' + prop + (linefeed ? END_OF_LINE : '') : '';
  }
}

SSE.Comment = Comment;
function Comment (content) {
  if (!(this instanceof Comment)) return new SSE.Comment(content);
  this.toString = content.toString.bind(content);
};


SSE.Retry = Retry;
function Retry (delay) {
  if (!(this instanceof Retry)) return new SSE.Retry(delay);
  if (typeof delay === 'number') {
    this.milliseconds = delay
  } else if (typeof delay === 'string') {
    this.milliseconds = ms(delay)
    if (!this.milliseconds) {
      throw Error(`Wrong delay parameter: ${delay}. You should send a number or a string parsable by the module "ms"`)
    }
  } else {
    throw Error(`Wrong delay parameter: ${delay}. You should send a number or a string parsable by the module "ms"`)
  }
}
