"use strict"

module.export = (config) => {

  return (req, res) => {
    req.logout()
    res.sendStatus(200)
  }
}
