const { check, oneOf } = require('express-validator')

const responseType = require('../enums/responseType')

const Server = require('../entity/server')
const API = require('../entity/api')
const Response = require('../entity/response')

const DataBase = require('../db')
const ServerRepository = require('../repository/serverRepository')
const APIRepository = require('../repository/apiRepository')
const ResponseRepository = require('../repository/responseRepository')
const basicRequestHandler = require('../handler/basicRequestHandler')

const mockServerCheck = [
  check('name').isLength({ min: 1 }),
  check('status').exists(),
  check('api').exists(),
  check('api.*.url').exists(),
  check('api.*.type').exists(),
  check('api.*.status').exists(),
  check('api.*.response').exists(),
  check('api.*.response.*.key').exists(),
  check('api.*.response.*.value').exists(),
  check('api.*.response.*.fixed').exists(),
  check('api.*.response.*.type').exists(),
  oneOf([
    check('api.*.response.*.children').not().exists(),
    check('api.*.response.*.children').custom(value => {
      const nestedCheck = value => {
        for (const child of value) {
          if (!Object.prototype.hasOwnProperty.call(child, 'key')
            ||!Object.prototype.hasOwnProperty.call(child, 'value')
            ||!Object.prototype.hasOwnProperty.call(child, 'fixed')
            ||!Object.prototype.hasOwnProperty.call(child, 'type')) {
            return Promise.reject()
          }
          if (child.type === responseType.OBJECT || child.type === responseType.ARRAY) {
            if (!Object.prototype.hasOwnProperty.call(child, 'children')) {
              return Promise.reject()
            }
            else return nestedCheck(child.children)
          }
        }
        return value
      }
      return nestedCheck(value)
    })
  ])
]

function setupServerRoutes(app) {
  const db = new DataBase()
  const serverRepository = new ServerRepository()
  const apiRepository = new APIRepository()
  const responseRepository = new ResponseRepository()

  app.get('/api/mock_server', basicRequestHandler((req, res) => {
    db.getConnection(async function(error, connection) {
      if (error) throw error
      const serverList = await serverRepository.findAll(connection)
      res.status(200).send(serverList.map(server => new Server(server)))
    })
  }))

  app.post('/api/mock_server/:name', mockServerCheck, basicRequestHandler((req, res) => {
    return new Promise((resolve, reject) => {
      db.getConnection(function(error, connection) {
        if (error) reject(error)
        connection.beginTransaction(async function(error) {
          if (error) reject(error)
          try {
            const data = new Server(req.body)
            const test = await serverRepository.insert(connection, data.getObject())
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
            await insertAPI(req.body.api)

            connection.commit(function(error) {
              if (error) {
                return connection.rollback(function() {
                  reject(error)
                })
              }
              res.status(200).send()
              resolve()
            })
          } catch(error) {
            reject(error)
          }
        })
      })
    })
  }))
}

module.exports = setupServerRoutes