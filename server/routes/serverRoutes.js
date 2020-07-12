const { check } = require('express-validator')
const Server = require('../entity/server')
const ServerRepository = require('../repository/serverRepository')
const basicRequestHandler = require('../handler/basicRequestHandler')

function setupServerRoutes(app, db) {
  const serverRepository = new ServerRepository()

  app.post('/api/mock_server/:name', [
    check('name').isLength({ min: 1 }),
    check('routes').exists(),
    check('status').exists()
  ], basicRequestHandler((req, res) => {
      const data = new Server(req.body)

      db.getConnection(function(error, connection) {
        if (error) throw error
        connection.beginTransaction(async function(error) {
          if (error) throw error
          const test = await serverRepository.insert(connection, data)
          console.log(test.insertId)
          connection.commit(function(error) {
            if (error) {
              return connection.rollback(function() {
                throw error
              })
            }
          })
        })
      })
      res.status(200).send()
    }
  ))
}

module.exports = setupServerRoutes