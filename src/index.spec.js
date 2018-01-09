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
  var returnVal = {}

  before(() => {
    returnVal = localStrategy(config)
  })

  it("should call configPassport", () => {
    sinon.assert.calledWith(configPassport, config)
  })

  it("should call router", () => {
    sinon.assert.calledWith(router, config)
  })

  it("should return router", () => {
    expect(returnVal).to.equal(router)
  })
})
