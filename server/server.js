const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const { check, validationResult } = require('express-validator')
const setupDB = require('./db')

const pool = setupDB()

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

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

const app = express()
const port = 3001

const createMockServer = (name, data) => {

}

const deleteMockServer = name => {

}


app.use(bodyParser.json())
app.use(compression({ filter: shouldCompress }))

app.get('/api/mock_server', basicRequestHandler((req, res) => {

}))
app.get('/api/mock_server/:name', basicRequestHandler((req, res) => {

}))

app.post('/api/mock_server/:name', [
    check('name').isLength({ min: 1 }),
    check('port').exists(),
    check('routes').exists()
  ], basicRequestHandler((req, res) => {
    const data = req.body
    const name = req.params.name
    console.log(data, name)
    res.status(200).send()
  }
))

app.put('/api/mock_server/:name', [
    check('name').isLength({ min: 1 }),
    check('port').exists(),
    check('routes').exists()
  ], basicRequestHandler((req, res) => {
    const data = req.body
    const name = req.params.name
    const newName = req.body.name
    console.log()
    res.status(200).send()
  }
))

app.delete('/api/mock_server/:name', basicRequestHandler((req, res) => {
  const name = req.params.name
  
  res.status(200).send()
}))

app.use(express.static(path.join(__dirname, '../build')))
app.use((req, res) => res.sendFile(path.join(__dirname, '../build/index.html')))

app.listen(port, () => console.log(`AcuMock app listening on port ${port}!`))
