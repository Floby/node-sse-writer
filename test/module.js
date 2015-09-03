var stream = require('stream');
var expect = require('chai').expect;

describe('the module', function () {
  it('is requirable', function () {
    var SSE = require('../')
  });
})

describe('an instance', function () {
  var SSE = require('../');
  var sse = SSE();
  it('is a readable stream', function () {
    expect(sse).to.be.an.instanceof(stream.Readable);
  })
})
