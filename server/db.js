const mysql = require('mysql')

function DataBase() {
  this.pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'acu_mock'
  })
}

module.exports = DataBase