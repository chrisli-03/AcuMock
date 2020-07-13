function Server(data) {
  this.name = data.name
  this.status = data.status
  this.redirectAddress = data.redirectAddress || ''
  Object.defineProperty(this, 'api', {
    enumerable: false,
    value: data.api
  })
}

module.exports = Server