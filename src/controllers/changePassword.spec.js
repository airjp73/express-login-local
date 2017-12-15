"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var changePassword = require('./changePassword')

var mocks = require('./testMocks')

var middleware = changePassword(mocks.config)

var req = {
  body: {
    password: "password",
    newPassword: "newPassword"
  },
  user: {
    id: mocks.user.id
  }
}

describe("changePassword successfull test case", () => {

  before(() => {
    middleware(req, mocks.res, mocks.next)
  })

  it("should not error", () => {
    sinon.assert.notCalled(mocks.next)
  })

  it("should change password and call updateUser", () => {
    sinon.assert.called(mocks.config.database.updateUser)
    var user = mocks.config.database.updateUser.getCall(0).args[0]
    expect(user.password).to.equal(req.body.newPassword + mocks.vals.hashSuffix)
  })

  

})
