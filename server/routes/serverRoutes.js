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
  check('api.*.response.*.response_key').exists(),
  check('api.*.response.*.response_value').exists(),
  check('api.*.response.*.fixed').exists(),
  check('api.*.response.*.type').exists(),
  oneOf([
    check('api.*.response.*.children').not().exists(),
    check('api.*.response.*.children').custom(value => {
      const nestedCheck = value => {
        for (const child of value) {
          if (!Object.prototype.hasOwnProperty.call(child, 'response_key')
            ||!Object.prototype.hasOwnProperty.call(child, 'response_value')
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
      connection.release()
    })
  }))

  app.get('/api/mock_server/:serverName', basicRequestHandler((req, res) => {
    db.getConnection(async function(error, connection) {
      if (error) throw error
      const server = (await serverRepository.findByServerName(connection, req.params.serverName))[0]
      const apiList = await apiRepository.findByServerID(connection, server.id)
      for (let i = 0; i < apiList.length; i++) {
        let responseList = await responseRepository.findByAPIID(connection, apiList[i].id)
        let responseHead = null
        const hashmap = new Map()
        responseList.forEach(response => {
          hashmap.set(response.id, response)
          response.children = []
        })
        responseList.forEach(response => {
          if (response.parent === null) responseHead = response
          else hashmap.get(response.parent).children.push(response)
        })
        apiList[i].response = [responseHead]
      }
      server.api = apiList
      res.status(200).send(server)
      connection.release()
    })
  }))

  app.get('/api/mock_server/:serverID/api', basicRequestHandler((req, res) => {
    db.getConnection(async function(error, connection) {
      if (error) throw error
      const apiList = await apiRepository.findByServerID(connection, req.params.serverID)
      res.status(200).send(apiList)
      connection.release()
    })
  }))

  app.get('/api/mock_server/:serverID/api/:apiID/response', basicRequestHandler((req, res) => {
    db.getConnection(async function(error, connection) {
      if (error) throw error
      const apiList = await responseRepository.findByAPIID(connection, req.params.apiID)
      res.status(200).send(apiList)
      connection.release()
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
            const test = await serverRepository.insert(connection, data)
            const insertResponse = async (responses, api, parent=null) => {
              for (const response of responses) {
                response.api = api
                response.parent = parent
                const responseData = new Response(response)
                const responseId = await responseRepository.insert(connection, responseData)
                if (response.children) {
                  await insertResponse(response.children, api, responseId.insertId)
                }
              }
            }
            const insertAPI = async (apis) => {
              for (const api of apis) {
                api.server = test.insertId
                const apiData = new API(api)
                const apiId = await apiRepository.insert(connection, apiData)
                await insertResponse(api.response, apiId.insertId)
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
          } finally {
            connection.release()
          }
        })
      })
    })
  }))
}

module.exports = setupServerRoutes