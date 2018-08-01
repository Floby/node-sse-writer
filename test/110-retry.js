const SSE= require('../')
var expect = require('chai').expect;

describe('new SSE.Retry(delay)', () => {
  describe('when delay is a number', () => {
    describe('.milliseconds', () => {
      const retry = SSE.Retry(1000)
      it('is the same number', () => {
        expect(retry.milliseconds).to.equal(1000)
      })
    })
  })
  describe('when delay is a string parsable by `ms`', () => {
    describe('.milliseconds', () => {
      const retry = SSE.Retry('5s')
      it('is that parsed number', () => {
        expect(retry.milliseconds).to.equal(5000)
      })
    })
  })
  describe('when delay is a string not parsable by `ms`', () => {
    describe('.milliseconds', () => {
      it('throws', () => {
        expect(() => SSE.Retry('hello')).to.throw(/Wrong delay parameter/)
      })
    })
  })
  describe('when delay is invalid', () => {
    describe('.milliseconds', () => {
      it('throws', () => {
        expect(() => SSE.Retry(null)).to.throw(/Wrong delay parameter/)
      })
    })
  })
})
