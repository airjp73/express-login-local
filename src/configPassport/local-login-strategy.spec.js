"use strict"

var sinon = require('sinon')
var chai = require('chai')
chai.use(require('chai-passport-strategy'))

var sandbox = sinon.createSandbox()
var mockReq = {
  email: "test@test.com",
  password: "testpass"
}
var mockConfig = {
  database: {
    newUser: sandbox.stub(),
    getUser: sandbox.stub(),
    saveUser: sandbox.stub()
  }
}
var strategy = require('./local-login-strategy')(mockConfig)

var user, info

describe("local-login-strategy", () => {

  before(() => {
    chai.passport.use(strategy)
      .success((u, i) => {
        user = u
        info = i
        done()
      })
      .fail((i) => {
        console.log(i)
      })
      .error((err) => {
        console.log(err)
      })
      .req((req) => {
        req.body = {}
        req.body.email = mockReq.email
        req.body.password =mockReq.password
      })
      .authenticate()
  })

  beforeEach(() => {
    sandbox.reset()
  })

  it("should return user with no password", () => {
    console.log(user)
    console.log(info)
  })
})
