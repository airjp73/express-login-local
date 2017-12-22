var chai = require('chai')
var expect = chai.expect

var ex = require('./index.js')

describe("src", () => {
  it("should export an object", () => {
    expect(ex).to.be.an('object')
  })

  it("should have init function", () => {
    expect(ex.init).to.exist
  })
})
