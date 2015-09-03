var stream = require('stream');
var expect = require('chai').expect;
var SSE = require('../');
var sink = require('stream-sink');

describe('a sse stream', function () {
  var sse;
  beforeEach(function () {
    sse = SSE();
  })
  describe('when calling .end() right away', function () {
    it('results in an empty stream', function (done) {
      sse.pipe(sink()).on('data', function(contents) {
        expect(contents).to.equal('');
        done();
      });
      sse.end()
    });
  });

  describe('.write', function () {
    describe('called with a string value', function () {
      it('writes an anonymous event', function (done) {
        sse.pipe(sink()).on('data', function(contents) {
          expect(contents).to.equal('data: hello world\r\n\r\n');
          done();
        });
        sse.write('hello world');
        sse.end();
      });
    });

    describe('called with an array of 2', function () {
      it('writes a named event', function (done) {
        sse.pipe(sink()).on('data', function(contents) {
          expect(contents).to.equal('event: custom name\r\ndata: event data\r\n\r\n');
          done();
        });
        sse.write(['custom name', 'event data']);
        sse.end();
      });
    });
  });
});
