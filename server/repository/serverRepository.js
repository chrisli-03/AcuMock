const Repository = require('./repository')

function ServerRepository() {}

ServerRepository.prototype = new Repository()
ServerRepository.prototype.table = 'tb_server'

module.exports = ServerRepository