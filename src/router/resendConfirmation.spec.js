"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var resendConfirmation = require('./resendConfirmation')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = resendConfirmation(mocks.config)

describe("resendConfirmation", () => {
  describe("success case", () => {

    var req = {
      headers: {
        host: "localhost"
      },
      user: {
        id: mocks.user.id
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
      expect( proj.indexOf(con.fields.EMAIL)                ).to.be.above(-1)
      expect( proj.indexOf(con.fields.EMAIL_CONFIRMED)      ).to.be.above(-1)
      expect( proj.indexOf(con.fields.CONFIRM_EMAIL_TOKEN)  ).to.be.above(-1)
    })

    it("should sendStatus 202", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(202)
    })

    it("should send email with link", () => {
      sinon.assert.called(mocks.config.mailer.sendEmail)
      var template = mocks.config.mailer.sendEmail.getCall(0).args[0]
      var link = mocks.config.mailer.sendEmail.getCall(0).args[2].link
      expect(template).to.equal(con.emails.CONFIRM)
      expect(link).to.equal("http://localhost" + con.routes.CONFIRM_EMAIL + "?token=" + mocks.vals.token)
    })
  })

  describe("failure case: email already confirmed", () => {
    var req = {
      headers: {
        host: "localhost"
      },
      user: {
        id: mocks.user.id
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.emailConfirmed = true
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

    it("should not send email", () => {
      sinon.assert.notCalled(mocks.config.mailer.sendEmail)
    })
  })
})
