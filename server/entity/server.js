class Server {
  constructor({ id, name, description, status, redirectAddress }) {
    this.id = id
    this.name = name
    this.description = description
    this.status = status
    this.redirectAddress = redirectAddress || ''
  }
}

module.exports = Server