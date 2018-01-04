module.exports = (config) => {
  return (req, res, next) => {
    if (config.options.noEmail)
      return res.sendStatus(404)
    next()
  }
}
