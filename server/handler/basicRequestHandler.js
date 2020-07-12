const { validationResult } = require('express-validator')

const basicRequestHandler = fn => async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        message: 'Validation Error.',
        errors: errors.array()
      }
    }
    await fn(req, res)
  } catch(e) {
    console.log(e)
    switch (e.message) {
      case 'Mock Server Already Running.':
      case 'Mock Server Not Running.':
        res.status(400).send(e.message)
        break
      case 'Mock Server Does Not Exist.':
        res.status(404).send(e.message)
        break
      case 'Server Exists.':
      case 'Port Already In Use.':
        res.status(409).send(e.message)
        break
      case 'Validation Error.':
        res.status(422).send(e.errors)
        break
      default:
        res.status(500).send(e.message)
    }
  }
}

module.exports = basicRequestHandler