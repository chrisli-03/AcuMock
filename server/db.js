const mysql = require('mysql')

class DataBase {
  constructor() {
    if (!DataBase._instance) {
      this.pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'acu_mock'
      })
      DataBase._instance = this
    }
    return DataBase._instance
  }

  getConnection(callback) {
    return this.pool.getConnection(callback)
  }
}

module.exports = DataBase