const Repository = require('./repository')

class ResponseRepository extends Repository {
  constructor() {
    super('tb_response')
  }
}

module.exports = ResponseRepository