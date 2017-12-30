"use strict"

//3rd party
var express = require("express")

//middleware
var requireLoggedIn = require("./middleware/requireLoggedIn")
var requireFields = require("require-fields")

//modules
var controllers = require("./controllers")
var con = require("./constants")


module.exports = (config, passport) => {

  var router = express.Router()

  router.route( con.routes.SIGNUP ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_SIGNUP),
    controllers.signup(config)
  )

  router.route( con.routes.LOGIN ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_LOGIN),
    controllers.login(config)
  )

  router.route( con.routes.LOGOUT ).post(
    requireLoggedIn,
    controllers.logout(config)
  )

  router.route( con.routes.RESEND_CONFIRMATION ).post(
    requireLoggedIn,
    controllers.resendConfirmation(config)
  )

  router.route( con.routes.CONFIRM_EMAIL ).post(
    requireFields([
      con.fields.CONFIRM_EMAIL_TOKEN
    ]),
    controllers.confirmEmail(config)
  )

  router.route( con.routes.CHANGE_PASSWORD ).post(
    requireFields([
      con.fields.EMAIL,
      con.fields.PASSWORD,
      con.fields.NEW_PASSWORD
    ]),
    passport.authenticate(con.passport.LOCAL_LOGIN),
    controllers.changePassword(config)
  )

  router.route( con.routes.FORGOT_PASSWORD ).post(
    requireFields([
      con.fields.EMAIL
    ]),
    controllers.forgotPassword(config)
  )

  router.route( con.routes.RESET_PASSWORD ).post(
    requireFields([
      con.fields.RESET_PASSWORD_TOKEN,
      con.fields.NEW_PASSWORD
    ]),
    controllers.resetPassword(config)
  )

  return router
}
