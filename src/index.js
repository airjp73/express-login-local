"use strict"

module.exports = {
  configPassport: require('./configPassport'),
  router: require('./router'),

  init: (config, passport) => {
    configPassport(config, passport)
    return router(config, passport)
  }
}
