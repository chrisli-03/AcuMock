const Response = require('../entity/response')
const Repository = require('./repository')

class ResponseRepository extends Repository {
  constructor() {
    super('tb_response', Response)
  }

  findByAPIID(connection, apiID) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${this.table} WHERE api=${apiID}`, (error, results, fields) => {
        if (error) reject(error)
        else resolve(this.convertType(results))
      })
    })
  }
}

module.exports = ResponseRepository