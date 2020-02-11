const path = require('path')
const fs = require('fs')
const MockServer = require('./MockServer')

const { readMockServerFile } = require('./fileHandler')

const init = mockServers => {
  const apiDirectory = path.join(__dirname, 'api')
  fs.readdir(apiDirectory, function(err, files) {
    if (err) {
      return console.log(`Unable to scan directory: ${err}`)
    }
    files.forEach(function(file, i) {
      if (!/\.json$/.test(file)) return
      const apiData = readMockServerFile(file.replace(/\.json$/, ''))
      const mockServer = new MockServer(apiData.routes, apiData.port)
      mockServers.set(file.replace(/\.json$/, ''), mockServer)
    })
  })
}

module.exports = init
