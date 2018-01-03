"use strict"

var con = require('../constants')

module.exports = (config) => {

  return async (req, res, next) => {
    try {

      var selection = {
        confirmEmailToken: req.body.confirmEmailToken
      }
      var fields = [
        con.fields.EMAIL,
        con.fields.EMAIL_CONFIRMED,
        con.fields.CONFIRM_EMAIL_TOKEN
      ]

      var user = await config.database.getUser(selection, fields)
      if (!user)
        return res.status(404).json({message:"No user found with that token"})

      user.emailConfirmed = true
      user.confirmEmailToken = undefined
      user = await config.database.updateUser(user)

      res.sendStatus(200)

      config.mailer.sendEmail(con.emails.CONFIRM_THANK_YOU, user.email, {})

    }
    catch(err) {
      next(err)
    }
  }
}
