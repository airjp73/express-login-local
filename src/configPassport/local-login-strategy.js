"use strict"

var LocalStrategy = require('passport-local').Strategy
var con = require('../constants')

module.exports = (config) => {
  return new LocalStrategy ({
    usernameField : con.fields.EMAIL,
    passwordField : con.fields.PASSWORD,
    passReqToCallback : true
  },
  async (req, email, password, done) => {
    try {
      var user = await config.database.getUser({[con.fields.EMAIL]: email}, [con.fields.PASSWORD])

      if (!user)
        return done(null, false, {message : "no user found"})
      if (!config.encrypt.matchPassword(password, user[con.fields.PASSWORD]))
        return done(null, false, {message : "invalid password"})

      //make password undefined just to be safe
      user[con.fields.PASSWORD] = undefined
      return done(null, user)

    }
    catch(err) {
      done(err)
    }
  }
)}
