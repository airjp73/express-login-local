"use strict"

var con = require('../constants')
var passport = require('passport')

module.exports = (config) => {
  var localSignupStrategy = require('./local-signup-strategy')(config)
  var localLoginStrategy  = require('./local-login-strategy')(config)

  passport.use(con.passport.LOCAL_SIGNUP,  localSignupStrategy)
  passport.use(con.passport.LOCAL_LOGIN, localLoginStrategy)
}
