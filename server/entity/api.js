function API(data) {
  this.server = data.server
  this.url = data.url
  this.type = data.type
  this.status = data.status
  Object.defineProperty(this, 'response', {
    enumerable: false,
    value: data.response
  })
}

module.exports = API