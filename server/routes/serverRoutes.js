const { check } = require('express-validator')
const Server = require('../entity/server')
const API = require('../entity/api')
const Response = require('../entity/response')
const ServerRepository = require('../repository/serverRepository')
const APIRepository = require('../repository/apiRepository')
const ResponseRepository = require('../repository/responseRepository')
const basicRequestHandler = require('../handler/basicRequestHandler')

function setupServerRoutes(app, db) {
  const serverRepository = new ServerRepository()
  const apiRepository = new APIRepository()
  const responseRepository = new ResponseRepository()

  app.post('/api/mock_server/:name', [
    check('name').isLength({ min: 1 }),
    check('api').exists(),
    check('status').exists()
  ], basicRequestHandler((req, res) => {
      const data = new Server(req.body)

      db.getConnection(function(error, connection) {
        if (error) throw error
        connection.beginTransaction(async function(error) {
          if (error) throw error
          const test = await serverRepository.insert(connection, data)
          const insertResponse = async (responses, api, parent=null) => {
            for (const response of responses) {
              response.api = api
              response.parent = parent
              const responseData = new Response(response)
              const responseId = await responseRepository.insert(connection, responseData)
              if (responseData.children) {
                await insertResponse(responseData.children, api, responseId.insertId)
              }
            }
          }
          const insertAPI = async (apis) => {
            for (const api of apis) {
              api.server = test.insertId
              const apiData = new API(api)
              const apiId = await apiRepository.insert(connection, apiData)
              await insertResponse(apiData.response, apiId.insertId)
            }
          }
          await insertAPI(data.api)

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