class Server {
  constructor({ id, name, status, redirectAddress }) {
    this.id = id
    this.name = name
    this.status = status
    this.redirectAddress = redirectAddress || ''
  }

  getObject() {
    return {
      name: this.name,
      status: this.status,
      redirectAddress: this.redirectAddress
    }
  }
}

module.exports = Server