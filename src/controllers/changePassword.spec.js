"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var changePassword = require('./changePassword')

var mocks = require('./testMocks')
var con = require('../constants')

var middleware = changePassword(mocks.config)

describe("changePassword", () => {
  describe("success case", () => {

    var req = {
      body: {
        password: "password",
        newPassword: "newPassword"
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
      expect( proj.indexOf(con.fields.EMAIL)    ).to.be.above(-1)
      expect( proj.indexOf(con.fields.PASSWORD) ).to.be.above(-1)
    })

    it("should change password and call updateUser", () => {
      sinon.assert.called(mocks.config.database.updateUser)
      var user = mocks.config.database.updateUser.getCall(0).args[0]
      expect(user.password).to.equal(req.body.newPassword + mocks.vals.hashSuffix)
    })

    it("should sendStatus 200", () => {
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

  describe("failure case: wrong password", () => {
    var req = {
      body: {
        password: "wrongPass",
        newPassword: "newPassword"
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

    it("should sendStatus 401", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(401)
    })

    it("no updateUser or email", () => {
      sinon.assert.notCalled(mocks.config.database.updateUser)
      sinon.assert.notCalled(mocks.config.mailer.sendEmail)
    })
  })

  describe("failure case: no user found", () => {
    var req = {
      body: {
        password: "password",
        newPassword: "newPassword"
      },
      user: {
        id: 11111111
      }
    }

    before(() => {
      mocks.reset()
      middleware(req, mocks.res, mocks.next)
    })

    it("should error", () => {
      sinon.assert.called(mocks.next)
    })
  })
})
