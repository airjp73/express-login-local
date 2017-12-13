"use strict"

var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

//mocks
var sandbox = sinon.createSandbox()
var mockUser = {
  email: "test@test.com",
  password: "testpass"
}
var mockConfig = {
  database: {
    saveUser: sandbox.stub(),
    getUser: sandbox.stub().callsFake((selection, projection = []) => {
      if (selection.email != mockUser.email)
        return undefined
      return mockUser
    })
  },
  encrypt: {
    matchPassword: sandbox.stub().callsFake((pass1, pass2) => {
      return pass1 == pass2
    })
  }
}

var strategy = require('./local-login-strategy')(mockConfig)
strategy.success = sandbox.stub()
strategy.fail = sandbox.stub()
strategy.error = sandbox.stub()


describe("local-login-strategy", () => {

  beforeEach(() => {
    sandbox.resetHistory()
  })

  it("should return user with no password", async () => {
    var req = {
      body: {
        email: mockUser.email,
        password: mockUser.password
      }
    }
    await strategy.authenticate(req)

    sinon.assert.notCalled(strategy.fail)
    sinon.assert.calledOnce(strategy.success)

    var user = strategy.success.getCall(0).args[0]
    expect(user.email).to.equal(mockUser.email)
    expect(user.password).to.be.undefined
  })

  it("should 401 if bad password", async () => {
    var req = {
      body: {
        email: mockUser.email,
        password: "nomatch"
      }
    }
    await strategy.authenticate(req)

    sinon.assert.notCalled(strategy.success)
    sinon.assert.calledOnce(strategy.fail)
  })

  it("should fail if no matching user", async () => {
    var req = {
      body: {
        email: "nomatch@email.com",
        password: mockUser.password
      }
    }
    await strategy.authenticate(req)

    sinon.assert.notCalled(strategy.success)
    sinon.assert.calledOnce(strategy.fail)
  })

})
