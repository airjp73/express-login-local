"use strict"

module.exports = (config) => {

  return (req, res) => {
    req.logout()
    res.sendStatus(200)
  }
}
