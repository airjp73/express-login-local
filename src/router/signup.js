"use strict"

var con = require('../constants')

module.exports = (config) => {

  return async (req, res, next) => {
    res.sendStatus(200)

    try {
      config.mailer.sendEmail(con.emails.CONFIRM, req.user.email, {
          link: "http://" + req.headers.host + con.routes.CONFIRM_EMAIL + "?token=" + req.user.confirmEmailToken,
        })
    }
    catch(err) {
      next(err)
    }

  }
}
