const Repository = require('./repository')

class ServerRepository extends Repository {
  constructor() {
    super('tb_server')
  }
}

module.exports = ServerRepository