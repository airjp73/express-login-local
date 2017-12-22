var chai = require('chai')
var expect = chai.expect

var ex = require('./index.js')

describe("configPassport", () => {
  it("should export a function", () => {
    expect(ex).to.be.a('function')
  })
})
