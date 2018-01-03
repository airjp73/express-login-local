"use strict"

var con = require('../constants')

module.exports = (config) => {

  return async (req, res, next) => {
    var selection = {_id: req.user.id}
    var fields = [
      con.fields.EMAIL,
      con.fields.EMAIL_CONFIRMED,
      con.fields.CONFIRM_EMAIL_TOKEN
    ]

    try {
      var user = await config.database.getUser(selection, fields)
      if (user.emailConfirmed)
        return res.status(403).json({message:"Email already confirmed"})
      res.sendStatus(202)

      await config.mailer.sendEmail(con.emails.CONFIRM, user.email, {
          link: "http://" + req.headers.host + con.routes.CONFIRM_EMAIL + "?token=" + user.confirmEmailToken,
        })
    }
    catch (err) {
      next(err)
    }
  }
}
