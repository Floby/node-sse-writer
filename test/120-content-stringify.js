var stream = require('stream');
var expect = require('chai').expect;
var SSE = require('../');
var sink = require('stream-sink');

describe('a sse stream', function () {
  var sse;
  beforeEach(function () {
    sse = SSE();
  })
  describe('.write', function () {
    describe('called with a single object value', function () {
      it('writes a stringify JSON anonymous event', function () {
        sse.write({ say: 'Hello World!'});
        sse.end();
        return sse.pipe(sink()).then(function(contents) {
          expect(contents).to.equal('data: {"say":"Hello World!"}\r\n\r\n');
        });
      });
    });

    describe('called with an array of 2 with an object', function () {
      it('writes a named event with stringified JSON', function () {
        sse.write(['custom name', {my: 'data'}]);
        sse.end();
        return sse.pipe(sink()).then(function(contents) {
          expect(contents).to.equal('event: custom name\r\ndata: {"my":"data"}\r\n\r\n');
        });
      });
    });

    describe('called with an array of 3 with one object at the end', function () {
      it('writes named event with ID', function () {
        sse.write([8000,'custom name', {my: 'data'}]);
        sse.end();
        return sse.pipe(sink()).then(function(contents) {
          expect(contents).to.equal('id: 8000\r\nevent: custom name\r\ndata: {"my":"data"}\r\n\r\n');
        });
      });
    });
  });
});

