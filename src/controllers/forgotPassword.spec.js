"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var forgotPassword = require('./forgotPassword')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = forgotPassword(mocks.config)

describe("confirmEmail", () => {
  describe("success case", () => {

    var req = {
      body: {
        email: mocks.user.email
      }
    }

    before(() => {
      mocks.reset()
      middleware(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should create resetPasswordToken and resetPasswordTokenExpires and updateUser", () => {
      sinon.assert.called(mocks.config.database.updateUser)
      var user = mocks.config.database.updateUser.getCall(0).args[0]
      expect(user.resetPasswordToken).to.equal(mocks.vals.token)
      expect(user.resetPasswordExpires).to.be.an.instanceof(Date)
    })

    it("should sendStatus 200", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(200)
    })

    it("should send email", () => {
      sinon.assert.called(mocks.config.mailer.sendEmail)
      var template = mocks.config.mailer.sendEmail.getCall(0).args[0]
      expect(template).to.equal(con.emails.FORGOT_PASSWORD)
    })
  })

  describe("failure case: no use found", () => {
    var req = {
      body: {
        email: "nomatch"
      }
    }

    before(() => {
      mocks.reset()
      middleware(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 404", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(404)
    })

    it("no updateUser or email", () => {
      sinon.assert.notCalled(mocks.config.database.updateUser)
      sinon.assert.notCalled(mocks.config.mailer.sendEmail)
    })
  })
})
