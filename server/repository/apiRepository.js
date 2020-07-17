const Repository = require('./repository')

class APIRepository extends Repository {
  constructor() {
    super('tb_api')
  }
}

module.exports = APIRepository