class API {
  constructor({ id, server, url, type, status }) {
    this.id = id
    this.server = server
    this.url = url
    this.type = type
    this.status = status
  }
}

module.exports = API