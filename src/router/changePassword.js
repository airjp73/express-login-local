"use strict"

var con = require('../constants')

module.exports = (config) => {

  return async (req, res, next) => {
    try {
      var password = req.body.password
      var newPassword = req.body.newPassword
      var user = await config.database.getUser({_id: req.user.id}, [con.fields.EMAIL, con.fields.PASSWORD])
      var hash = user.password

      if (!config.encrypt.matchPassword(password, hash))
        return res.sendStatus(401)
      user.password = config.encrypt.hashPassword(newPassword)
      await config.database.updateUser(user)

      res.sendStatus(200)
      config.mailer.sendEmail(con.emails.PASSWORD_CHANGED, user.email, {})

    }
    catch(err) {
      next(err)
    }
  }
}
