"use strict"

var configPassport = require('./configPassport')
var router = require('./router')
function init(config, passport) {
  configPassport(config, passport)
  return router(config, passport)
}

module.exports = {
  configPassport,
  router,
  init
}
