const express = require('express')

class MockServer {
  constructor(apiData, port) {
    this.app = express()
    this.port = port
    for (const route in apiData) {
      const api = apiData[route]
      this.app[api.method](route, (req, res) => {
        res.status(api.status).send(api.data)
      })
    }
  }

  start() {
    this.server = this.app.listen(this.port, () => { console.log(`Mock server started on port ${this.port}.`)})
  }

  stop() {
    this.server.close(() => { console.log(`Mock server on port ${this.port} has stopped.`)})
  }
}

module.exports = MockServer
