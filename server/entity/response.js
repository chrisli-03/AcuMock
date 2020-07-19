class Response {
  constructor({ id, api, parent, response_key, response_value, fixed, type }) {
    this.id = id
    this.api = api
    this.parent = parent
    this.response_key = response_key
    this.response_value = response_value
    this.fixed = fixed
    this.type = type
  }
}

module.exports = Response