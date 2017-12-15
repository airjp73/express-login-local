"use strict"

var LocalStrategy = require('passport-local').Strategy
var con = require('../constants')

module.exports = (config) => {
  return new LocalStrategy({
    usernameField : con.fields.EMAIL,
    passwordField : con.fields.PASSWORD,
    passReqToCallback : true
  },
  async (req, email, password, done) => {
    try {

      //check for existing user
      var user = await config.database.getUser({email: email})
      if (user)
        return done(null, false, {message: con.fields.EMAIL + " in use"})

      //populate user data and save
      var token = config.encrypt.genToken(16)
      var hash  = config.encrypt.hashPassword(password)
      var userData = {}
      userData.email = email
      userData.password = hash
      userData.confirmEmailToken = token
      user = await config.database.newUser(userData)

      //make password undefined just to be safe
      //make sure confirmEmailToken is present in case it has select: false
      user.password = undefined
      user.confirmEmailToken = token

      return done(null, user)

    }
    catch(err) {
      done(err)
    }
  }
)}
