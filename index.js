const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const MockServer = require('./src/MockServer')
const Mock = require('./src/mock')

const app = express()
const port = 3000
const mockServers = new Map()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.post('/api/mock_server', (req, res) => {
  try {
    const data = req.body
    Mock.createMockServerFile(data.name, data)
    const mockServer = new MockServer(data.routes, data.port)
    mockServers.set(data.name, mockServer)
    res.status(200).send()
  } catch(e) {
    switch (e.message) {
      case 'Server Exists':
        res.status(409).send(e.message)
        break
      default:
        res.status(500).send(e.message)
    }
  }
})
app.patch('/api/mock_server/status/:name', (req, res) => {
  const server = mockServers.get(req.params.name)
  if (!server) {
    res.status(404).send('Mock Server Not Found.')
    return
  }
  try {
    server[req.body.running ? 'start' : 'stop']()
    res.status(200).send()
  } catch(e) {
    switch (e.message) {
      case 'Mock Server Already Running.':
      case 'Mock Server Not Running.':
        res.status(400).send(e.message)
        break
      default:
        res.status(500).send(e.message)
    }
  }
})

const apiDirectory = path.join(__dirname, 'api')
fs.readdir(apiDirectory, function(err, files) {
  if (err) {
    return console.log(`Unable to scan directory: ${err}`)
  }
  files.forEach(function(file, i) {
    if (!/\.json$/.test(file)) return
    const apiData = JSON.parse(fs.readFileSync(path.join(apiDirectory, file)))
    const mockServer = new MockServer(apiData.routes, apiData.port)
    mockServers.set(file.replace(/\.json$/, ''), mockServer)
  })
})

app.listen(port, () => console.log(`AcuMock app listening on port ${port}!`))
