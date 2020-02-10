const express = require('express')
const portfinder = require('portfinder')

class MockServer {
  constructor(apiData) {
    portfinder.getPort((err, port) => {
      this.server = express()
      this.port = port
      for (const route in apiData) {
        const api = apiData[route]
        this.server[api.method](route, function(req, res) {
          res.status(api.status).send(api.data)
        })
      }
      this.server.listen(this.port, () => { console.log(`Mock server started on port ${this.port}`)})
    })
  }
}

module.exports = MockServer
