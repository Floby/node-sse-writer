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

    describe('called successively with a value and an array of 2', function () {
      it('writes an anonymous event and a named event', function (done) {
        sse.pipe(sink()).on('data', function(contents) {
          expect(contents).to.equal('data: anon\r\n\r\nevent: custom name\r\ndata: event data\r\n\r\n');
          done();
        });
        sse.write('anon');
        sse.write(['custom name', 'event data']);
        sse.end();
      });
    });

    describe('called with an array of 3', function () {
      it('writes named event with ID', function (done) {
        sse.pipe(sink()).on('data', function(contents) {
          expect(contents).to.equal('id: 8000\r\nevent: custom name\r\ndata: event data\r\n\r\n');
          done();
        });
        sse.write([8000,'custom name', 'event data']);
        sse.end();
      });
    });

    describe('with a multiline string as value', function () {
      it('writes a multiline anonymous event', function (done) {
        sse.pipe(sink()).on('data', function(contents) {
          expect(contents).to.equal('data: hello\r\ndata: world\r\ndata: this is great!\r\ndata: isn\'t it?\r\n\r\n');
          done();
        });
        sse.write('hello\nworld\r\nthis is great!\risn\'t it?');
        sse.end();
      });
    });

    describe('with a SSE.Comment', function () {
      it('writes a comment line', function (done) {
        sse.pipe(sink()).on('data', function(contents) {
          expect(contents).to.equal(': Hello!\r\ndata: event\r\n\r\n');
          done();
        });
        sse.write(SSE.Comment('Hello!'));
        sse.write('event');
        sse.end();
      });
    });

    describe('with a SSE.Retry', function () {
      it('writes a retry line', function (done) {
        sse.pipe(sink()).on('data', function(contents) {
          expect(contents).to.equal('retry: 3600000\r\n\r\ndata: event\r\n\r\n');
          done();
        });
        sse.write(SSE.Retry('1 hour'));
        sse.write('event');
        sse.end();
      });
    });
  });
});
