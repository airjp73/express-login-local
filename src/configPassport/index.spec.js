var chai = require('chai')
var expect = chai.expect
var proxyquire = require('proxyquire')
var sinon = require('sinon')

var con = require('../constants')


var loginMock = {hi: "hi"}
var signupMock = {bye: "bye"}
var passport = {
  use: sinon.spy()
}
proxyquire('./index.js', {
  'passport' : passport,
  './local-login-strategy' : (config) => {
    return loginMock
  },
  './local-signup-strategy' : (config) => {
    return signupMock
  }
})


var ex = require('./index.js')

describe("configPassport", () => {
  it("should export a function", () => {
    expect(ex).to.be.a('function')
  })

  describe("function behavior", () => {
    before(() => {
      var config = {}
      ex(config, passport)
    })
    it("should call passport.use", () => {
      sinon.assert.calledWith(passport.use, con.passport.LOCAL_LOGIN, loginMock)
      sinon.assert.calledWith(passport.use, con.passport.LOCAL_SIGNUP, signupMock)
    })
  })
})
