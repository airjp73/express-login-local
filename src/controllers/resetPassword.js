"use strict"

var con = require('../constants')

module.exports = (config) => {

  return async (req, res, next) => {
    try {
      var user = await config.database.getUser({resetPasswordToken: req.body.resetPasswordToken}, [con.fields.EMAIL, con.fields.RESET_PASSWORD_EXPIRES])

      if (!user)
        return res.status(404).json({message: "no user with that resetPasswordToken"})

      if (Date.now() > user.resetPasswordExpires) {
        res.status(403).json({message:"Reset password token expired"})
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await config.database.updateUser(user)
        return
      }

      user.password = encrypt.hashPassword(req.body.newPassword)
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      user = await config.database.updateUser(user)

      res.sendStatus(200)

      config.mailer.sendEmail(con.emails.PASSWORD_CHANGED, user.email, {})
    }
    catch(err) {
      next(err)
    }
  }
}
}
