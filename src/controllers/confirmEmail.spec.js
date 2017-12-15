"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var confirmEmail = require('./confirmEmail')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = confirmEmail(mocks.config)

describe("confirmEmail", () => {
  describe("success case", () => {

    var req = {
      body: {
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

    it("should change confirmEmailToken to undefined and emailConfirmed to true", () => {
      sinon.assert.called(mocks.config.database.updateUser)
      var user = mocks.config.database.updateUser.getCall(0).args[0]
      expect(user.confirmEmailToken).to.be.undefined
      expect(user.emailConfirmed).to.be.true
    })

    it("should sendStatus 200", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(200)
    })

    it("should send email", () => {
      sinon.assert.called(mocks.config.mailer.sendEmail)
      var template = mocks.config.mailer.sendEmail.getCall(0).args[0]
      expect(template).to.equal(con.emails.CONFIRM_THANK_YOU)
    })
  })

  describe("failure case: no use found", () => {
    var req = {
      body: {
        confirmEmailToken: 1232121212
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
