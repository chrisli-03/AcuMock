const express = require('express')
const http = require('http')

class MockServer {
  constructor(apiData, port) {
    this.app = express()
    this.port = port
    this.running = false
    for (const method in apiData) {
      for (const route in apiData[method]) {
        const api = apiData[method][route]
        this.app[method](route, (req, res) => {
          res.status(api.status).send(api.data)
        })
      }
    }
  }

  start() {
    if (this.running) throw new Error('Mock Server Already Running.')
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(
        this.port,
        () => {
          console.log(`Mock server started on port ${this.port}.`)
          this.running = true
          resolve()
        }
      ).on('error', e => {
        if (e.errno === 'EADDRINUSE') {
          reject(new Error('Port Already In Use.'))
        } else {
          reject(new Error('Failed To Start Mock Server.'))
        }
      })
    })
  }

  stop() {
    if (!this.server || !this.running) throw new Error('Mock Server Not Running.')
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        console.log(`Mock server on port ${this.port} has stopped.`)
        this.running = false
        resolve()
      })
    })
  }
}

module.exports = MockServer
