import React, { useReducer, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'

import { getMockServer } from '../store/mockServer/actions'

import Spinner from '../components/Spinner'

const INIT = 'INIT'
const UPDATE = 'UPDATE'
const DELETE = 'DELETE'

const recursiveStateChange = (state, keys, level, value) => {
  return Object.assign({}, state, {
    [keys[level]]: level < keys.length-1 ? recursiveStateChange(state[keys[level]], keys, level+1, value) : value
  })
}

const recursiveDelete = (state, keys) => {
  const copyState = JSON.parse(JSON.stringify(state))
  const toDelete = keys.pop()
  const targetParam = keys.reduce((acc, n) => acc[n], copyState)
  delete targetParam[toDelete]
  return copyState
}

const reducer = (state, action) => {
  switch (action.type) {
    case INIT:
      return action.payload
    case UPDATE:
      return recursiveStateChange(state, action.key.split('.').slice(1), 0, action.payload)
    case DELETE:
      return recursiveDelete(state, action.key.split('.').slice(1))
    default:
      return state
  }
}

const defaultMockServer = {
  name: '',
  port: '',
  routes: {
    get: {},
    post: {},
    put: {},
    patch: {},
    delete: {}
  },
  _configurations$: {
    name: { type: 'input', variant: 'text' },
    port: { type: 'input', variant: 'number' },
    routes: {
      get: {},
      post: {},
      put: {},
      patch: {},
      delete: {}
    }
  }
}

const defaultInsertData = {
  routes: {
    get: {},
    post: {},
    put: {},
    patch: {},
    delete: {}
  }
}

const MockServerDetail = ({ mockServers, getMockServer }) => {
  const { name } = useParams()
  const history = useHistory()
  const mockServer = mockServers[name]
  const [mockServerData, updateMockServerData] = useReducer(reducer, defaultMockServer)
  const [insertData, updateInsertData] = useReducer(reducer, defaultInsertData)

  useEffect(() => {
    if (name) getMockServer(name)
  }, [getMockServer, name])

  useEffect(() => {
    if (mockServer && !mockServer.fetching) {
      updateMockServerData({ type: INIT, payload: mockServer.data })
      const insertData = {
        routes: {
          _get: { name: '', type: '' },
          _post: { name: '', type: '' },
          _put: { name: '', type: '' },
          _patch: { name: '', type: '' },
          _delete: { name: '', type: '' }
        }
      }
      const generateInsertData = (routes, insertData) => {
        Object.keys(routes).forEach(key => {
          if (typeof routes[key] === 'object') {
            insertData[`_${key}`] = { name: '', variant: '' }
            insertData[key] = {}
            generateInsertData(routes[key], insertData[key])
          }
        })
        return insertData
      }
      generateInsertData(mockServer.data.routes, insertData.routes)
      updateInsertData({ type: INIT, payload: insertData })
    }
  }, [mockServer])

  if (name && (!mockServer || mockServer.fetching)) {
    return (
      <Spinner />
    )
  }

  const handleChange = event => {
    updateMockServerData({
      type: UPDATE,
      key: event.target.dataset.key,
      payload: event.target.value
    })
    event.preventDefault()
  }

  const handleInsertChange = event => {
    updateInsertData({
      type: UPDATE,
      key: event.target.dataset.key,
      payload: event.target.value
    })
    event.preventDefault()
  }

  const insertAPI = (event, name, key) => {
    event.preventDefault()
    const newAPI = [...name.substring(1).split('.'), `_${key}`].reduce((acc, n) => acc[n], insertData).name
    if (!/^\//.test(newAPI)) {
      console.log('not valid')
      return
    }
    if (typeof [...name.substring(1).split('.'), `${key}`].reduce((acc, n) => acc[n], mockServerData)[newAPI] !== 'undefined') {
      console.log('exist')
      return
    }
    updateMockServerData({
      type: UPDATE,
      key: `._configurations$${name}.${key}.${newAPI}`,
      payload: {
        "status": {
          "type": "input",
          "variant": "number"
        },
        "data": {}
      }
    })
    updateInsertData({
      type: UPDATE,
      key: `${name}.${key}._${newAPI}`,
      payload: { name: '', variant: '' }
    })
    updateInsertData({
      type: UPDATE,
      key: `${name}.${key}.${newAPI}`,
      payload: {
        "_data": { name: '', variant: '' }
      }
    })
    updateMockServerData({
      type: UPDATE,
      key: `${name}.${key}.${newAPI}`,
      payload: {
        "status": 200,
        "data": {}
      }
    })
    updateInsertData({
      type: UPDATE,
      key: `${name}._${key}`,
      payload: ''
    })
  }

  const insertParam = (event, name, key) => {
    event.preventDefault()
    const { name: newParam, variant } = [...name.substring(1).split('.'), `_${key}`].reduce((acc, n) => acc[n], insertData)
    if (!variant) {
      console.log('no variant')
      return
    }
    if (typeof [...name.substring(1).split('.'), `${key}`].reduce((acc, n) => acc[n], mockServerData)[newParam] !== 'undefined') {
      console.log('exist')
      return
    }

    switch (variant) {
      case 'text':
      case 'number':
      case 'boolean':
        updateMockServerData({
          type: UPDATE,
          key: `._configurations$${name}.${key}.${newParam}`,
          payload: {
            "type": "input",
            "variant": variant
          }
        })
        updateMockServerData({
          type: UPDATE,
          key: `${name}.${key}.${newParam}`,
          payload: ''
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}._${key}`,
          payload: ''
        })
        break
      case 'object':
      case 'array':
        updateMockServerData({
          type: UPDATE,
          key: `._configurations$${name}.${key}.${newParam}`,
          payload: {}
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}.${key}._${newParam}`,
          payload: { name: '', variant: '' }
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}.${key}.${newParam}`,
          payload: {}
        })
        updateMockServerData({
          type: UPDATE,
          key: `${name}.${key}.${newParam}`,
          payload: {}
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}._${key}`,
          payload: ''
        })
        break
      default:
        return
    }
  }

  const deleteParam = (event, name, key) => {
    event.preventDefault()
    updateMockServerData({
      type: DELETE,
      key: `${name}.${key}`
    })
    updateMockServerData({
      type: DELETE,
      key: `._configurations$${name}.${key}`
    })
    updateInsertData({
      type: DELETE,
      key: `${name}.${key}`
    })
    updateInsertData({
      type: DELETE,
      key: `${name}._${key}`
    })
  }

  const handleSubmit = event => {
    const type = name ? 'put' : 'post'
    axios[type](`/api/mock_server/${mockServerData.name}`, mockServerData).then(response => {
      history.push('/')
    })
    event.preventDefault()
  }

  const cancel = event => {
    event.preventDefault()
    history.push('/')
  }

  const generateRouteForm = (routes, name, configurations, insertData) => {
    return Object.keys(routes).filter(route => route !== '_configurations$').map(key => {
      const id = `${name}.${key}`
      if (Array.isArray(routes[key])) return []
      if (typeof routes[key] === 'object') {
        return (
          <div key={id}>
            <div>
              {`${key}: {`}
              {}
              {/^\.routes.(get|post|put|patch|delete)\.(\/.+)+$/.test(id) && !/^\.routes.(get|post|put|patch|delete)\.(\/.+)+.data$/.test(id) ?
                <button onClick={event => deleteParam(event, name, key)}>x</button>
                : null
              }
            </div>
            <div style={{paddingLeft: '1rem'}}>
              {generateRouteForm(routes[key], id, configurations[key], insertData[key])}
              {/^\.routes.(get|post|put|patch|delete)$/.test(id) ?
                <div>
                  <input
                    data-key={`${name}._${key}.name`}
                    value={insertData[`_${key}`] ? insertData[`_${key}`].name : ''}
                    onChange={handleInsertChange}
                  />
                  <button onClick={event => insertAPI(event, name, key)}>+</button>
                </div>
                : null}
              {/^\.routes.(get|post|put|patch|delete)\.(\/.+)+\.data/.test(id) ?
                <div>
                  <input
                    data-key={`${name}._${key}.name`}
                    value={insertData[`_${key}`] ? insertData[`_${key}`].name : ''}
                    onChange={handleInsertChange}
                  />
                  <select
                    data-key={`${name}._${key}.variant`}
                    value={insertData[`_${key}`] ? insertData[`_${key}`].variant : ''}
                    onChange={handleInsertChange}
                  >
                    <option value="" disabled>--select--</option>
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="object">object</option>
                    <option value="array">array</option>
                  </select>
                  <button onClick={event => insertParam(event, name, key)}>+</button>
                </div>
                : null}
            </div>
            {'}'}
          </div>
        )
      }
      const configuration = configurations[key]
      if (!configuration) return null
      switch (configuration.type) {
        case 'input':
          return (
            <div key={id}>
              <label htmlFor={id}>{key}: </label>
              <input
                id={id}
                data-key={id}
                data-variant={configuration.variant}
                value={routes[key]}
                onChange={handleChange}
              />
              {(!/^\.routes.(get|post|put|patch|delete)\.(\/.+)+.status$/.test(id) && !/^.(name|port)$/.test(id)) ?
                <button onClick={event => deleteParam(event, name, key)}>x</button>
                : null}
            </div>
          )
        case 'select':
          return (
            <div key={id}>
              <label htmlFor={id}>{key}: </label>
              <select
                id={id}
                data-key={id}
                data-variant={configuration.variant}
                value={routes[key]}
                onChange={handleChange}
              >
                {configuration.options.map(option => (
                  <option value={option.value} key={`${id}_${option.value}`}>{option.label}</option>
                ))}
              </select>
              {(!/^\.routes.(get|post|put|patch|delete)\.(\/.+)+.status$/.test(id) && !/^.(name|port)$/.test(id)) ?
                <button onClick={event => deleteParam(event, name, key)}>x</button>
                : null}
            </div>
          )
        default:
          return null
      }
    })
  }

  const routeForm = generateRouteForm(mockServerData, '', mockServerData._configurations$, insertData)

  return (
    <form id="form" onSubmit={handleSubmit}>
      {routeForm}
      <button type="submit" form="form" value="Submit">Submit</button>
      <button onClick={cancel}>Cancel</button>
    </form>
  )
}

const mapStateToProps = state => ({
  mockServers: state.mockServers
})

const mapDispatchToProps = dispatch => ({
  getMockServer: name => dispatch(getMockServer(name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MockServerDetail)
