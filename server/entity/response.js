function Response(data) {
  this.api = data.api
  this.parent = data.parent
  this.response_key = data.key
  this.response_value = data.value
  this.fixed = data.fixed
  this.type = data.type
  Object.defineProperty(this, 'children', {
    enumerable: false,
    value: data.children
  })
}

module.exports = Response