"use strict"

var con = require('../constants')

module.exports = (config, passport) => {
  var localSignupStrategy = require('./local-signup-strategy')(config)
  var localLoginStrategy  = require('./local-login-strategy')(config)

  passport.use(con.passport.LOCAL_SIGNUP,  localSignupStrategy)
  passport.use(con.passport.LOCAL_LOGIN, localLoginStrategy)
}
