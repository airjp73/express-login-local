"use strict"

var sinon = require('sinon')
var sandbox = sinon.createSandbox()

var vals = {
  token: 123456,
  hashSuffix: "hash"
}

var user = {
  id: 1234,
  email: "test@user.com",
  password: "password" + vals.hashSuffix
}

var config = {
  database: {
    newUser: sandbox.stub(),
    getUser: sandbox.stub(),
    updateUser: sandbox.stub()
  },
  mailer: {
    sendEmail: sandbox.stub()
  },
  encrypt: {
    matchPassword: sandbox.stub(),
    hashPassword: sandbox.stub(),
    genToken: sandbox.stub()
  }
}

var status = sandbox.stub()
var res = {
  sendStatus: status,
  status: status,
  json: sandbox.stub()
}
var next = sandbox.spy()

function reset() {
  sandbox.reset()

  config.database.newUser.returnsArg(0)
  config.database.getUser.callsFake((select) => {
    if (select._id == user.id)
      return user
    return null
  })
  config.database.updateUser.returnsArg(0)

  config.encrypt.matchPassword.callsFake((pass, hash) => {
    return (pass + vals.hashSuffix) == hash
  })
  config.encrypt.hashPassword.callsFake((pass) => {
    return pass + vals.hashSuffix
  })
  config.encrypt.genToken.returns(vals.token)

  status.returns(res)
}

reset()

module.exports = {
  sandbox,
  user,
  config,
  vals,
  res,
  status,
  next,
  reset
}
