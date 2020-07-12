function Server(data) {
  this.name = data.name
  this.status = data.status
  this.redirectAddress = data.redirectAddress || ''
  Object.defineProperty(this, 'routes', {
    enumerable: false,
    value: data.routes
  })
}

module.exports = Server