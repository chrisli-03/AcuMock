const express = require('express')
const http = require('http')

class MockServer {
  constructor(apiData, port) {
    this.app = express()
    this.port = port
    this.running = false
    for (const route in apiData) {
      const api = apiData[route]
      this.app[api.method](route, (req, res) => {
        res.status(api.status).send(api.data)
      })
    }
  }

  start() {
    if (this.running) throw new Error('Mock Server Already Running.')
    this.server = this.app.listen(
      this.port,
      () => {
        console.log(`Mock server started on port ${this.port}.`)
        this.running = true
      }
    ).on('error', function (e) {
      if (e.errno === 'EADDRINUSE') {
        throw new Error('Port Already In Use.')
      } else {
        throw new Error('Failed To Start Mock Server.')
      }
    })
  }

  stop() {
    if (!this.server || !this.running) throw new Error('Mock Server Not Running.')
    this.server.close(() => {
      console.log(`Mock server on port ${this.port} has stopped.`)
      this.running = false
    })
  }
}

module.exports = MockServer
