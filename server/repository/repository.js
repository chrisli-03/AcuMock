function Repository(table) {
  Object.defineProperty(this, 'table', {
    enumerable: false,
    value: table
  })
}

Repository.prototype.insert = function(connection, data) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${this.table} SET ?`, data, function(error, results, fields) {
      if (error) reject(error)
      else resolve(results)
    })
  })
}

module.exports = Repository