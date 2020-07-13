const Repository = require('./repository')

function APIRepository() {}

APIRepository.prototype = new Repository()
APIRepository.prototype.table = 'tb_api'

module.exports = APIRepository