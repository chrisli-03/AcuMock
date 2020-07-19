const API = require('../entity/api')
const Repository = require('./repository')

class APIRepository extends Repository {
  constructor() {
    super('tb_api', API)
  }

  findByServerID(connection, serverID) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${this.table} WHERE server=${serverID}`, (error, results, fields) => {
        if (error) reject(error)
        else resolve(this.convertType(results))
      })
    })
  }
}

module.exports = APIRepository