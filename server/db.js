const mysql = require('mysql')

const setupDB = () => {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'acu_mock'
  })

  return pool
}

module.exports = setupDB