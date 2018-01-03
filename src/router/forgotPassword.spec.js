"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var forgotPassword = require('./forgotPassword')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = forgotPassword(mocks.config)

describe("forgotPassword", () => {
  describe("success case", () => {

    var req = {
      headers: {
        host: "localhost"
      },
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

    it("should call getUser and supply all need fields to projection", () => {
      sinon.assert.called(mocks.config.database.getUser)
      var proj = mocks.config.database.getUser.getCall(0).args[1]
      expect(proj).to.be.an('array')
      expect( proj.indexOf(con.fields.EMAIL)    ).to.be.above(-1)
    })

    it("should create resetPasswordToken and resetPasswordTokenExpires and updateUser", () => {
      sinon.assert.called(mocks.config.database.updateUser)
      var user = mocks.config.database.updateUser.getCall(0).args[0]
      expect(user.resetPasswordToken).to.equal(mocks.vals.token)
      expect(user.resetPasswordExpires).to.be.above(Date.now())
    })

    it("should sendStatus 200", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(200)
    })

    it("should send email with link", () => {
      sinon.assert.called(mocks.config.mailer.sendEmail)
      var template = mocks.config.mailer.sendEmail.getCall(0).args[0]
      var link = mocks.config.mailer.sendEmail.getCall(0).args[2].link
      expect(template).to.equal(con.emails.FORGOT_PASSWORD)
      expect(link).to.equal("http://localhost" + con.routes.RESET_PASSWORD + "?token=" + mocks.vals.token)
    })
  })

  describe("failure case: no user found", () => {
    var req = {
      headers: {
        host: "localhost"
      },
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
