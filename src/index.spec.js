var chai = require('chai')
var expect = chai.expect

var ex = require('./index.js')

describe("index.js", () => {
  it("should export and object", () => {
    expect(ex).to.be.an('object')
  })
})
