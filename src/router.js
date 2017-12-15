"use strict"

//3rd party
var express = require("express")

//middleware
var requireLoggedIn = require("./middleware/requireLoggedIn")
var requireFields = require("require-fields")

//modules
var controllers = require("./controllers")
var con = require("../constants")


module.exports = (config, passport) => {

  var auth = express.Router()

  auth.route( con.routes.SIGNUP ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_SIGNUP),
    controllers.signup(config)
  )

  auth.route( con.routes.LOGIN ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_LOGIN),
    controllers.login(config)
  )

  auth.route( con.routes.LOGOUT ).post(
    requireLoggedIn,
    controllers.logout(config)
  )

  auth.route( con.routes.RESEND_CONFIRMATION ).post(
    requireLoggedIn,
    controllers.resendConfirmation(config)
  )

  auth.route( con.routes.CONFIRM_EMAIL ).post(
    requireFields([
      con.fields.CONFIRM_EMAIL_TOKEN
    ]),
    controllers.confirmEmail(config)
  )

  auth.route( con.routes.CHANGE_PASSWORD ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD,
      con.fields.NEW_PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_LOGIN),
    controllers.changePassword(config)
  )

  auth.route( con.routes.FORGOT_PASSWORD ).post(
    requireFields([
      con.fields.EMAIL
    ]),
    controllers.forgotPassword(config)
  )

  auth.route( con.routes.RESET_PASSWORD ).post(
    requireFields([
      con.fields.RESET_PASSWORD_TOKEN,
      con.fields.NEW_PASSWORD
    ]),
    controllers.resetPassword(config)
  )

  return auth
}
