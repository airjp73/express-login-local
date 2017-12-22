var chai = require('chai')
var expect = chai.expect

var ex = require('./index.js')

describe("controllers", () => {
  it("should export an object", () => {
    expect(ex).to.be.a('object')
  })
})
