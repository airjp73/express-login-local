"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var resetPassword = require('./resetPassword')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = resetPassword(mocks.config)

describe("resetPassword", () => {
  describe("success case", () => {

    var req = {
      body: {
        resetPasswordToken: mocks.vals.token,
        newPassword: "newPassword"
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.resetPasswordExpires = Date.now() + 360000
      middleware(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should set password to newPasswordhash and remove resetPassword fields", () => {
      sinon.assert.calledOnce(mocks.config.database.updateUser)
      var user = mocks.config.database.updateUser.getCall(0).args[0]
      expect(user.password).to.equal(req.body.newPassword + mocks.vals.hashSuffix)
      expect(user.resetPasswordExpires).to.be.undefined
      expect(user.resetPasswordExpires).to.be.undefined
    })

    it("should call getUser and supply all need fields to projection", () => {
      sinon.assert.called(mocks.config.database.getUser)
      var proj = mocks.config.database.getUser.getCall(0).args[1]
      expect(proj).to.be.an('array')
      expect( proj.indexOf(con.fields.EMAIL)                  ).to.be.above(-1)
      expect( proj.indexOf(con.fields.RESET_PASSWORD_EXPIRES) ).to.be.above(-1)
    })

    it("should sendStatus 202", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(200)
    })

    it("should send email", () => {
      sinon.assert.called(mocks.config.mailer.sendEmail)
      var template = mocks.config.mailer.sendEmail.getCall(0).args[0]
      expect(template).to.equal(con.emails.PASSWORD_CHANGED)
    })
  })

  describe("failure case: token expired", () => {
    var req = {
      body: {
        resetPasswordToken: mocks.vals.token,
        newPassword: "newPassword"
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.resetPasswordToken = mocks.vals.token
      mocks.user.resetPasswordExpires = Date.now() - 360000
      middleware(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 403", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(403)
    })

    it("should remove resetPassword fields and not change password", () => {
      sinon.assert.calledOnce(mocks.config.database.updateUser)
      var user = mocks.config.database.updateUser.getCall(0).args[0]
      expect(user.password).to.not.equal(req.body.newPassword + mocks.vals.hashSuffix)
      expect(user.resetPasswordExpires).to.be.undefined
      expect(user.resetPasswordExpires).to.be.undefined
    })

    it("should not send email", () => {
      sinon.assert.notCalled(mocks.config.mailer.sendEmail)
    })
  })

  describe("failure case: user not found", () => {
    var req = {
      body: {
        resetPasswordToken: 123132123,
        newPassword: "newPassword"
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.resetPasswordToken = mocks.vals.token
      mocks.user.resetPasswordExpires = Date.now() +360000
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

    it("should not send email or updateUser", () => {
      sinon.assert.notCalled(mocks.config.database.updateUser)
      sinon.assert.notCalled(mocks.config.mailer.sendEmail)
    })
  })
})
