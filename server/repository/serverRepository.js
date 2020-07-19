const Server = require('../entity/server')
const Repository = require('./repository')

class ServerRepository extends Repository {
  constructor() {
    super('tb_server', Server)
  }

  findByServerName(connection, serverName) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${this.table} WHERE name=${connection.escape(serverName)}`, (error, results, fields) => {
        if (error) reject(error)
        else resolve(this.convertType(results))
      })
    })
  }
}

module.exports = ServerRepository