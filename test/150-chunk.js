var SSE = require('../');
var Chunk = require('../').Chunk;
var expect = require('chai').expect;

describe('a Chunk instance', function () {
  var chunk;
  beforeEach(function () {
    chunk = new Chunk();
  })
  it('is an object', function () {
    expect(chunk).to.be.an('object');
  });

  describe('instanciated from a string', function () {
    beforeEach(function () {
      chunk = new Chunk('Hello World!');
    })
    describe('.getMessage()', function () {
      it('returns the string encapsulated with data', function () {
        expect(chunk.getMessage()).to.equal('data: Hello World!\r\n');
      })

      describe('for a multiline value', function () {
        beforeEach(function () {
          chunk = new Chunk('hello\nworld\rthis is\r\ncool');
        })
        it('returns several lines of encapsulated data', function () {
          expect(chunk.getMessage()).to.equal('data: hello\r\ndata: world\r\ndata: this is\r\ndata: cool\r\n');
        });
      });
    });

    describe('.getName()', function () {
      it('returns an empty string', function () {
        expect(chunk.getName()).to.equal('');
      });
    });
    describe('.getId()', function () {
      it('returns an empty string', function () {
        expect(chunk.getId()).to.equal('');
      });
    });
    describe('.getComment()', function () {
      it('returns an empty string', function () {
        expect(chunk.getComment()).to.equal('');
      });
    });
    describe('.getRetry()', () => {
      it('returns empty string', () => {
        expect(chunk.getRetry()).to.equal('')
      })
    })
  });

  describe('instanciated from an array of 1', function () {
    beforeEach(function () {
      chunk = new Chunk(['Hello World!']);
    })
    describe('.getMessage()', function () {
      it('treats the sole content as the message', function () {
        expect(chunk.getMessage()).to.equal('data: Hello World!\r\n');
      });
    })
    describe('.getName()', function () {
      it('returns an empty string', function () {
        expect(chunk.getName()).to.equal('');
      });
    });
    describe('.getId()', function () {
      it('returns an empty string', function () {
        expect(chunk.getId()).to.equal('');
      });
    });
    describe('.getComment()', function () {
      it('returns an empty string', function () {
        expect(chunk.getComment()).to.equal('');
      });
    });
    describe('.getRetry()', () => {
      it('returns empty string', () => {
        expect(chunk.getRetry()).to.equal('')
      })
    })
  })

  describe('instanciated from an array of 2', function () {
    beforeEach(function () {
      chunk = new Chunk(['custom', 'Hello World!']);
    })
    describe('.getMessage()', function () {
      it('treats the second element as the message', function () {
        expect(chunk.getMessage()).to.equal('data: Hello World!\r\n');
      });
    });
    describe('.getName()', function () {
      it('treas the first element as the name of the event', function () {
        expect(chunk.getName()).to.equal('event: custom\r\n');
      })
    });
    describe('.getId()', function () {
      it('returns an empty string', function () {
        expect(chunk.getId()).to.equal('');
      });
    });
    describe('.getComment()', function () {
      it('returns an empty string', function () {
        expect(chunk.getComment()).to.equal('');
      });
    });
    describe('.getRetry()', () => {
      it('returns empty string', () => {
        expect(chunk.getRetry()).to.equal('')
      })
    })
  });
  describe('instanciated from an array of 3', function () {
    beforeEach(function () {
      chunk = new Chunk([8000, 'custom', 'Hello World!']);
    })
    describe('.getMessage()', function () {
      it('treats the third element as the message', function () {
        expect(chunk.getMessage()).to.equal('data: Hello World!\r\n');
      });
    });
    describe('.getName()', function () {
      it('treats the second element as the name of the event', function () {
        expect(chunk.getName()).to.equal('event: custom\r\n');
      })
    });
    describe('.getId()', function () {
      it('treats the first element as the id of the event', function () {
        expect(chunk.getId()).to.equal('id: 8000\r\n');
      });
    });
    describe('.getComment()', function () {
      it('returns an empty string', function () {
        expect(chunk.getComment()).to.equal('');
      });
    });
    describe('.getRetry()', () => {
      it('returns empty string', () => {
        expect(chunk.getRetry()).to.equal('')
      })
    })
  });

  describe('instanciated with an instance of SSE.Comment', function () {
    beforeEach(function () {
      var comment = new SSE.Comment('Hello!');
      chunk = new Chunk(comment);
    })
    describe('.getComment()', function () {
      it('returns the contents of the comment after a ":"', function () {
        expect(chunk.getComment()).to.equal(': Hello!');
      });
    });
    describe('.getMessage()', function () {
      it('returns an empty string', function () {
        expect(chunk.getMessage()).to.equal('');
      });
    })
    describe('.getId()', function () {
      it('returns an empty string', function () {
        expect(chunk.getId()).to.equal('');
      });
    });
    describe('.getName()', function () {
      it('returns an empty string', function () {
        expect(chunk.getName()).to.equal('');
      });
    });
    describe('.getRetry()', () => {
      it('returns empty string', () => {
        expect(chunk.getRetry()).to.equal('')
      })
    })
  });

  describe('instanciated with an instance of SSE.Retry', () => {
    beforeEach(() => {
      const retry = new SSE.Retry(2000)
      chunk = new Chunk(retry)
    })
    describe('.getComment()', function () {
      it('returns empty string', function () {
        expect(chunk.getComment()).to.equal('');
      });
    });
    describe('.getMessage()', function () {
      it('returns an empty string', function () {
        expect(chunk.getMessage()).to.equal('');
      });
    })
    describe('.getId()', function () {
      it('returns an empty string', function () {
        expect(chunk.getId()).to.equal('');
      });
    });
    describe('.getName()', function () {
      it('returns an empty string', function () {
        expect(chunk.getName()).to.equal('');
      });
    });
    describe('.getRetry()', () => {
      it('returns the retry delay in ms', () => {
        expect(chunk.getRetry()).to.equal('retry: 2000\r\n')
      })
    })
  })
});
