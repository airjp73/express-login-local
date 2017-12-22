var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')

var router = sinon.spy()
var configPassport = sinon.spy()
var proxyquire = require('proxyquire')
proxyquire('./index.js', {
  './router': router,
  './configPassport': configPassport
})

var ex = require('./index.js')

describe("src", () => {


  it("should export an object", () => {
    expect(ex).to.be.an('object')
  })



  describe("init function", () => {
    var config = {}
    var passport = {}

    before(() => {
      ex.init(config, passport)
    })

    it("should have init function", () => {
      expect(ex.init).to.exist
    })

    it("should call configPassport", () => {
      sinon.assert.calledWith(configPassport, config, passport)
    })

    it("should call router", () => {
      sinon.assert.calledWith(router, config, passport)
    })
  })

})
