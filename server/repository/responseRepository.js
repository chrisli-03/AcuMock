const Repository = require('./repository')

function ResponseRepository() {}

ResponseRepository.prototype = new Repository()
ResponseRepository.prototype.table = 'tb_response'

module.exports = ResponseRepository