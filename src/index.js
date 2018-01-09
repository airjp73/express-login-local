"use strict"

var configPassport = require('./configPassport')
var router = require('./router')

module.exports = (config) => {
  configPassport(config)
  return router(config)
}
