"use strict"

var con = require('../constants')

module.exports = (config) => {

  return async (req, res, next) => {
    try {
      var user = await config.database.getUser({email: req.body.email}, [con.fields.EMAIL])
      if (!user)
        return res.status(404).json({message: "no user with that email"})
      user.resetPasswordToken = encrypt.genToken(con.encrypt.RESET_PASS_TOKEN_BITS)
      user.resetPasswordExpires = Date.now() + con.encrypt.RESET_PASS_TOKEN_DUR
      await config.database.updateUser(user)

      res.sendStatus(200)

      config.mailer.sendEmail(con.emails.FORGOT_PASSWORD, user.email, {
          link: "http://" + req.headers.host + con.routes.RESET_PASSWORD + "?token=" + user.resetPasswordToken
        })

    }
    catch(err) {
      next(err)
    }
  }
}
