"use strict"

var configPassport = require('./configPassport')
var router = require('./router')

module.exports = (config, passport) => {
  configPassport(config, passport)
  return router(config, passport)
}
