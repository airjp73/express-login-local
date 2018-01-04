var chai = require('chai')
var expect = chai.expect

var router = require('./index.js')

describe("router", () => {
  it("should export a function", () => {
    expect(router).to.be.a('function')
  })

  it("should return an express router", () => {
    var config = {
      options: {}
    }
    var passport = {
      authenticate: (str) => {
        return (req, res, next) => {}
      }
    }

    var routes = router(config, passport)
    expect(routes).to.be.a('function')
  })
})
