var expect = require('chai').expect;
var sink = require('stream-sink');
var SSE = require('../');

describe('a sse stream', function () {
  var actual, expected;

  beforeEach(function () {
    actual = SSE();
    expected = SSE();
  });

  describe('.comment()', function () {
    it('has the same effect as calling .write(SSE.Comment(value))', function (done) {
      expected.end(SSE.Comment('hello'));
      actual.comment('hello');
      actual.end();
      streamEqual(expected, actual, done);
    })
    it('returns this', function () {
      expect(actual.comment('hey')).to.equal(actual);
    })
  })
  describe('.retry()', function () {
    it('has the same effect as calling .write(SSE.Retry(value))', function (done) {
      const delay = '40 minutes'
      expected.end(SSE.Retry(delay));
      actual.retry(delay);
      actual.end();
      streamEqual(expected, actual, done);
    })
    it('returns this', function () {
      expect(actual.comment('hey')).to.equal(actual);
    })
  })
  describe('.event(data)', function () {
    it('has the same effect as calling .write(data)', function (done) {
      expected.end('hello');
      actual.event('hello');
      actual.end();
      streamEqual(expected, actual, done);
    })

    it('returns this', function () {
      expect(actual.event('hey')).to.equal(actual);
    })
  })
  describe('.event(name, data)', function () {
    it('has the same effect as calling .write([name, data])', function(done) {
      expected.end(['my-name', 'my-data']);
      actual.event('my-name', 'my-data');
      actual.end()
      streamEqual(expected, actual, done);
    })
  })

  describe('.event(id, name, data)', function () {
    it('has the same effect as calling .write([id, name, data])', function(done) {
      expected.end(['my-id', 'my-name', 'my-data']);
      actual.event('my-id', 'my-name', 'my-data');
      actual.end()
      streamEqual(expected, actual, done);
    })
  })

  describe('.event({id, name, data})', function () {
    it('has the same effect as calling .write([id, name, data])', function(done) {
      expected.end(['my-id', 'my-name', 'my-data']);
      actual.event({
        id: 'my-id',
        name: 'my-name',
        data: 'my-data'
      });
      actual.end()
      streamEqual(expected, actual, done);
    })
  })
  describe('.event({name, data})', function () {
    it('has the same effect as calling .write([name, data])', function(done) {
      expected.end(['my-name', 'my-data']);
      actual.event({
        name: 'my-name',
        data: 'my-data'
      });
      actual.end()
      streamEqual(expected, actual, done);
    })
  })
  describe('.event({id, name, data})', function () {
    it('has the same effect as calling .write([id, name, data])', function(done) {
      expected.end(['my-id', 'my-name', 'my-data']);
      actual.event({
        id: 'my-id',
        name: 'my-name',
        data: 'my-data'
      });
      actual.end()
      streamEqual(expected, actual, done);
    })
  })
  describe('.event({ ...data})', function () {
    it('has the same effect as calling .write(data)', function(done) {
      expected.end({my: 'data'});
      actual.event({my: 'data'});
      actual.end()
      streamEqual(expected, actual, done);
    })
  })

  describe('.write([data])', function () {
    it('has the same effect as calling .write(data)', function (done) {
      expected.end('hello');
      actual.end(['hello']);
      streamEqual(expected, actual, done);
    })
  })
})


function streamEqual (expectedStream, actualStream, callback) {
  var count = 2, expected, actual;
  expectedStream.pipe(sink()).then(function(e) {
    expected = e
    compareMaybe();
  });
  actualStream.pipe(sink()).then(function(a) {
    actual = a
    compareMaybe();
  });

  function compareMaybe () {
    if (--count == 0) {
      try {
        expect(actual).to.equal(expected);
        callback();
      } catch(e) {
        callback(e);
      }
    }
  }
}
