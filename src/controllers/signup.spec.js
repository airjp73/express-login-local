"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var signup = require('./signup')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = signup(mocks.config)

describe("signup", () => {
  describe("success case", () => {

    var req = {
      headers: {
        host: "localhost"
      },
      user: {
        email: mocks.user.email,
        confirmEmailToken: mocks.vals.token
      }
    }

    before(() => {
      mocks.reset()
      middleware(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
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
      expect(template).to.equal(con.emails.CONFIRM)
      expect(link).to.equal("http://localhost" + con.routes.CONFIRM_EMAIL + "?token=" + mocks.vals.token)
    })
  })
})
