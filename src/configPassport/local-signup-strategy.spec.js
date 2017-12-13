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
    newUser: sandbox.stub(),
    saveUser: sandbox.stub(),
    getUser: sandbox.stub()
  },
  encrypt: {
    genToken: sandbox.stub().returns("token"),
    hashPassword: sandbox.stub().returns("hash")
  }
}

var strategy = require('./local-signup-strategy')(mockConfig)
strategy.success = sandbox.stub()
strategy.fail = sandbox.stub()
strategy.error = sandbox.stub()

describe("local-signup-strategy", () => {

  describe("success", () => {
    before(async () => {
      var req = {
        body: {
          email: mockUser.email,
          password: mockUser.password
        }
      }
      mockConfig.database.getUser.returns(null)
      mockConfig.database.newUser.returns(mockUser)

      await strategy.authenticate(req)
    })

    it("should call newUser with email, hashed password, and confirmEmailToken", () => {
      sinon.assert.calledOnce(mockConfig.database.newUser)
      var args = mockConfig.database.newUser.getCall(0).args[0]
      expect(args.email).to.equal(mockUser.email)
      expect(args.password).to.equal("hash")
      expect(args.confirmEmailToken).to.equal("token")
    })

    it("should return user info with undefined password", () => {
      sinon.assert.calledOnce(strategy.success)
      var args = strategy.success.getCall(0).args[0]
      expect(args.email).to.equal(mockUser.email)
      expect(args.password).to.be.undefined
      expect(args.confirmEmailToken).to.equal("token")
    })

    it("should not fail", () => {
      sinon.assert.notCalled(strategy.fail)
    })

    it("should not error", () => {
      sinon.assert.notCalled(strategy.error)
    })
  })

  describe("failure", () => {
    beforeEach(() => {
      sandbox.reset()
    })

    it("should fail if email taken", async () => {
      var req = {
        body: {
          email: mockUser.email,
          password: mockUser.password
        }
      }
      mockConfig.database.getUser.returns(mockUser)
      mockConfig.database.newUser.returns(mockUser)

      await strategy.authenticate(req)

      sinon.assert.calledOnce(strategy.fail)
    })

    it("should fail if database throws", async () => {
      var req = {
        body: {
          email: mockUser.email,
          password: mockUser.password
        }
      }
      mockConfig.database.getUser.throws()

      await strategy.authenticate(req)

      sinon.assert.calledOnce(strategy.fail)
    })
  })
})
