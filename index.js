const path = require('path')
const fs = require('fs')
const express = require('express')
const MockServer = require('./src/MockServer')
console.log(MockServer)

const app = express()
const port = 3000

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const apiDirectory = path.join(__dirname, 'api')
fs.readdir(apiDirectory, function(err, files) {
  if (err) {
    return console.log(`Unable to scan directory: ${err}`)
  }
  const defaultPort = 30326
  files.forEach(function(file, i) {
    if (!/\.json$/.test(file)) return
    const apiData = JSON.parse(fs.readFileSync(path.join(apiDirectory, file)))
    const mockServer = new MockServer(apiData)
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
