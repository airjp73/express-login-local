"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var login = require('./login')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = login(mocks.config)

describe("login", () => {

  var req = {}

  before(() => {
    mocks.reset()
    middleware(req, mocks.res, mocks.next)
  })

  it("should not error", () => {
    sinon.assert.notCalled(mocks.next)
  })

  it("should sendStatus 200", () => {
    sinon.assert.calledOnce(mocks.status)
    var status = mocks.status.getCall(0).args[0]
    expect(status).to.equal(200)
  })
})
