var sinon = require('sinon')
var checkEmailOptions = require('./checkEmailOptions')

var sandbox = sinon.createSandbox()
var req = {}
var res = {sendStatus: sandbox.spy()}
var next = sandbox.spy()

var config = {
  options: {
    noEmail: true
  }
}

describe('checkEmailOptions middleware', () => {
  afterEach(() => {
    sandbox.reset()
  })

  it('should sendStatus 404 if noEmail: true', () => {
    checkEmailOptions(config)(req, res, next)

    sinon.assert.calledWith(res.sendStatus, 404)
    sinon.assert.notCalled(next)
  })

  it('should call next if noEmail: false', () => {
    config.options.noEmail = false

    checkEmailOptions(config)(req, res, next)

    sinon.assert.called(next)
    sinon.assert.notCalled(res.sendStatus)
  })
})
