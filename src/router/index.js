"use strict"

//3rd party
var express = require("express")
var passport = require('passport')

//middleware
var requireLoggedIn = require("./middleware/requireLoggedIn")
var requireFields = require("require-fields")
var checkEmailOptions = require('./middleware/checkEmailOptions')

//constants
var con = require("../constants")

//controllers
var changePassword      = require('./changePassword')
var confirmEmail        = require('./confirmEmail')
var forgotPassword      = require('./forgotPassword')
var login               = require('./login')
var logout              = require('./logout')
var resendConfirmation  = require('./resendConfirmation')
var resetPassword       = require('./resetPassword')
var signup              = require('./signup')


/////Router Setup
module.exports = (config) => {

  var router = express.Router()

  router.route( con.routes.SIGNUP ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_SIGNUP),
    signup(config)
  )

  router.route( con.routes.LOGIN ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_LOGIN),
    login(config)
  )

  router.route( con.routes.LOGOUT ).post(
    requireLoggedIn,
    logout(config)
  )

  router.route( con.routes.CHANGE_PASSWORD ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD,
      con.fields.NEW_PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_LOGIN),
    changePassword(config)
  )

  router.route( con.routes.RESEND_CONFIRMATION ).post(
    checkEmailOptions(config),
    requireLoggedIn,
    resendConfirmation(config)
  )

  router.route( con.routes.CONFIRM_EMAIL ).post(
    checkEmailOptions(config),
    requireFields([
      con.fields.CONFIRM_EMAIL_TOKEN
    ]),
    confirmEmail(config)
  )

  router.route( con.routes.FORGOT_PASSWORD ).post(
    checkEmailOptions(config),
    requireFields([
      con.fields.EMAIL
    ]),
    forgotPassword(config)
  )

  router.route( con.routes.RESET_PASSWORD ).post(
    checkEmailOptions(config),
    requireFields([
      con.fields.RESET_PASSWORD_TOKEN,
      con.fields.NEW_PASSWORD
    ]),
    resetPassword(config)
  )

  return router
}
