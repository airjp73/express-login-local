"use strict"

var localSignupStrategy = require('./local-signup-strategy')(config)
var localLoginStrategy  = require('./local-login-strategy')(config)

module.exports = (config, passport) {
  passport.use(con.passport.LOCAL_SIGNUP,  localSignupStrategy)
  passport.use(con.passport.LOCAL_LOGIN, localLoginStrategy)
}
