class Repository {
  constructor(table) {
    this.table = table
  }

  insert(connection, data) {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO ${this.table} SET ?`, data, function(error, results, fields) {
        if (error) reject(error)
        else resolve(results)
      })
    })
  }

  findAll(connection) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${this.table}`, function(error, results, fields) {
        if (error) reject(error)
        else resolve(results)
      })
    })
  }
}

module.exports = Repository