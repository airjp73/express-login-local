var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')

var router = sinon.stub()
router.returns(router)

var configPassport = sinon.spy()
var proxyquire = require('proxyquire')
proxyquire('./index.js', {
  './router': router,
  './configPassport': configPassport
})

var localStrategy = require('./index.js')

describe("src", () => {
  var config = {}
  var passport = {}
  var returnVal = {}

  before(() => {
    returnVal = localStrategy(config, passport)
  })

  it("should call configPassport", () => {
    sinon.assert.calledWith(configPassport, config, passport)
  })

  it("should call router", () => {
    sinon.assert.calledWith(router, config, passport)
  })

  it("should return router", () => {
    expect(returnVal).to.equal(router)
  })
})
