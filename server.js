const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')

const MockServer = require('./src/MockServer')
const { readMockServerFile, createMockServerFile, deleteMockServerFile } = require('./src/fileHandler')

const basicRequestHandler = fn => (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        message: 'Validation Error',
        errors: errors.array()
      }
    }
    fn(req, res)
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
      case 'Server Exists':
        res.status(409).send(e.message)
        break
      case 'Validation Error':
        res.status(422).send(e.errors)
        break
      default:
        res.status(500).send(e.message)
    }
  }
}

const startServer = mockServers => {
  const app = express()
  const port = 3000

  app.use(bodyParser.json())

  app.get('/', basicRequestHandler((req, res) => {
    res.sendFile(__dirname + '/index.html')
  }))
  app.get('/api/mock_server', basicRequestHandler((req, res) => {
    res.status(200).send([...mockServers.keys()])
  }))
  app.get('/api/mock_server/:name', basicRequestHandler((req, res) => {
    res.status(200).send(readMockServerFile(req.params.name))
  }))

  app.post('/api/mock_server/:name', [
      check('name').isLength({ min: 1 }),
      check('port').exists(),
      check('routes').exists()
    ], basicRequestHandler((req, res) => {
      const data = req.body
      const name = req.params.name
      createMockServerFile(name, data)
      const mockServer = new MockServer(data.routes, data.port)
      mockServers.set(name, mockServer)
      res.status(200).send()
    }
  ))

  app.patch('/api/mock_server/:name/status', [
      check('running').exists()
    ], basicRequestHandler((req, res) => {
      const server = mockServers.get(req.params.name)
      if (!server) {
        res.status(404).send('Mock Server Not Found.')
        return
      }
      server[req.body.running ? 'start' : 'stop']()
      res.status(200).send()
    }
  ))

  app.delete('/api/mock_server/:name', basicRequestHandler((req, res) => {
    const name = req.params.name
    deleteMockServerFile(name)
    const mockServer = mockServers.get(name)
    if (mockServer && mockServer.running) mockServer.stop()
    mockServers.delete(name)
    res.status(200).send()
  }))

  app.listen(port, () => console.log(`AcuMock app listening on port ${port}!`))
}

module.exports = startServer
