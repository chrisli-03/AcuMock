const path = require('path')
const fs = require('fs')
const express = require('express')
const MockServer = require('./src/MockServer')

const app = express()
const port = 3000
const mockServers = new Map()

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const apiDirectory = path.join(__dirname, 'api')
fs.readdir(apiDirectory, function(err, files) {
  if (err) {
    return console.log(`Unable to scan directory: ${err}`)
  }
  files.forEach(async function(file, i) {
    if (!/\.json$/.test(file)) return
    const apiData = JSON.parse(fs.readFileSync(path.join(apiDirectory, file)))
    const mockServer = new MockServer(apiData.routes, apiData.port)
    mockServer.start()
    mockServers.set(file.replace(/\.json$/, ''), mockServer)
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
