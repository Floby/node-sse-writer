var stream = require('stream');
var sinon = require('sinon');
var expect = require('chai').expect;
require('chai').use(require('sinon-chai'))
var SSE = require('../');

describe('a sse stream', function () {
  var actual, expected;

  beforeEach(function () {
    sse = SSE();
  });

  describe('.pipe(writable)', function () {
    describe('if writable has a setHeader method', function () {
      var writable
      beforeEach(function () {
        writable = new stream.PassThrough()
        writable.setHeader = sinon.stub()
      })
      it('calls it with ("Content-Type", "text/event-stream")', function () {
        sse.pipe(writable)
        expect(writable.setHeader).to.have.been.calledWith('Content-Type', 'text/event-stream')
      })

      describe('which throws', function () {
        beforeEach(function () {
          writable.setHeader.throws(Error('Not on my watch'))
        })
        it('does not throw', function () {
          expect(function () {
            sse.pipe(writable)
          }).not.to.throw(Error)
        })
      })
    })

  })
})
