import React, { useReducer, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { Form, Input, Button } from 'antd'

import { getMockServer } from '../store/mockServer/actions'
import { createAlert } from '../store/alert/actions'

import Spinner from '../components/Spinner'
import APITree from '../components/APITree'

const INIT = 'INIT'
const UPDATE = 'UPDATE'
const DELETE = 'DELETE'

const recursiveStateChange = (state, keys, level, value) => {
  if (level === keys.length-1) {
    if (Array.isArray(state)) {
      const prev = state.slice()
      prev[keys[level]] = value
      return prev
    }
    else {
      return Object.assign({}, state, {
        [keys[level]]: value
      })
    }
  }
  else if (level > keys.length-1) return value
  if (Array.isArray(state[keys[level]])) {
    const arr = state[keys[level]].slice()
    arr[keys[level+1]] = recursiveStateChange(state[keys[level]][keys[level+1]], keys, level+2, value)
    if (Array.isArray(state)) {
      const prev = state.slice()
      prev[keys[level]] = arr
      return prev
    }
    else {
      return Object.assign({}, state, {
        [keys[level]]: arr
      })
    }
  }
  else {
    return Object.assign({}, state, {
      [keys[level]]: recursiveStateChange(state[keys[level]], keys, level+1, value)
    })
  }
}

const recursiveDelete = (state, keys) => {
  const copyState = JSON.parse(JSON.stringify(state))
  const toDelete = keys.pop()
  const targetParam = keys.reduce((acc, n) => acc[n], copyState)
  if (Array.isArray(targetParam)) {
    targetParam.splice(Number(toDelete), 1)
  } else {
    delete targetParam[toDelete]
  }
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
  description: '',
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
    description: { type: 'input', variant: 'text' },
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

const MockServerDetail = ({ mockServers, getMockServer, createAlert }) => {
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
    let value = event.target.value
    if (!event.target.dataset) {
      event.target.dataset = {
        key: event.target['data-key'],
        variant: event.target['data-variant']
      }
    }
    switch(event.target.dataset.variant) {
      case 'number':
        value = Number(value)
        break
      case 'boolean':
        break
      case 'string':
      default:
    }
    updateMockServerData({
      type: UPDATE,
      key: event.target.dataset.key,
      payload: value
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

  const insertResponseData = (event, start, end, api, type) => {
    event.preventDefault()
    deleteParam({ preventDefault: () => {} }, `${start}.${end}.${api}`, 'data')
    insertParam({ preventDefault: () => {} }, `${start}.${end}`, api, undefined, { name: 'data', variant: type })
  }

  const insertParam = (event, name, key, index, payload) => {
    event.preventDefault()
    const { name: newParam, variant } = payload || [...name.substring(1).split('.'), `_${key}`].reduce((acc, n) => acc[n], insertData)
    if (!variant) {
      console.log('no variant')
      return
    }
    if (!payload && typeof [...name.substring(1).split('.'), `${key}`].reduce((acc, n) => acc[n], mockServerData)[newParam] !== 'undefined') {
      console.log('exist')
      return
    }

    switch (variant) {
      case 'text':
      case 'number':
      case 'boolean':
        updateMockServerData({
          type: UPDATE,
          key: `._configurations$${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: {
            type: 'input',
            variant
          }
        })
        updateMockServerData({
          type: UPDATE,
          key: `${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: ''
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}._${typeof index !== 'undefined' ? index : key}`,
          payload: ''
        })
        break
      case 'object':
        updateMockServerData({
          type: UPDATE,
          key: `._configurations$${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: {}
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}.${key}._${typeof index !== 'undefined' ? index : newParam}`,
          payload: { name: '', variant: '' }
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: {}
        })
        updateMockServerData({
          type: UPDATE,
          key: `${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: {}
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}._${typeof index !== 'undefined' ? index : key}`,
          payload: ''
        })
        break
      case 'array':
        updateMockServerData({
          type: UPDATE,
          key: `._configurations$${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: []
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}.${key}._${typeof index !== 'undefined' ? index : newParam}`,
          payload: { name: '', variant: '' }
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: {}
        })
        updateMockServerData({
          type: UPDATE,
          key: `${name}.${key}.${typeof index !== 'undefined' ? index : newParam}`,
          payload: []
        })
        updateInsertData({
          type: UPDATE,
          key: `${name}._${typeof index !== 'undefined' ? index : key}`,
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
    const newName = name || mockServerData.name
    axios[type](`/api/mock_server/${newName}`, mockServerData).then(response => {
      history.push('/')
      createAlert('Saved successfully', 'success')
    })
    event.preventDefault()
  }

  const cancel = event => {
    event.preventDefault()
    history.push('/')
  }

  const generateRouteForm = (routes, name, configurations, insertData) => {
    return Object.keys(routes.routes).map(type => {
      return <div key={type} style={{marginBottom: '0.5rem'}}>
        <h4>{type.toUpperCase()} Requests</h4>
        <div style={{marginLeft: '1rem'}}>
          {
            Object.keys(routes.routes[type]).map(api => {
              return <APITree
                prefix={`.routes.${type}`}
                api={api}
                routes={routes.routes[type][api]}
                configurations={configurations.routes[type][api]}
                insertData={insertData.routes[type][api]}
                insertParam={insertParam}
                handleChange={handleChange}
                handleInsertChange={handleInsertChange}
                deleteParam={deleteParam}
                key={api}
                insertResponseData={insertResponseData}
              />
            })
          }
          <div>
            <Input
              data-key={`.routes._${type}.name`}
              value={insertData.routes[`_${type}`] ? insertData.routes[`_${type}`].name : ''}
              onChange={handleInsertChange}
              placeholder="New API"
            />
            <Button type="link" onClick={event => insertAPI(event, '.routes', type)} style={{color: '#52c41a'}}>Add API</Button>
          </div>
        </div>
      </div>
    })
  }

  const routeForm = generateRouteForm(mockServerData, '', mockServerData._configurations$, insertData)

  return (
    <Form id="form" onSubmit={handleSubmit} style={{padding: '0.5rem'}}>
      <div style={{marginBottom: '0.5rem'}}>
        <div style={{marginBottom:'0.5rem'}}>
          <label htmlFor="name">Name: </label>
          <Input
            id="name"
            data-key=".name"
            data-variant={mockServerData._configurations$.name.variant}
            value={mockServerData.name}
            onChange={handleChange}
          />
        </div>
        <div style={{marginBottom:'0.5rem'}}>
          <label htmlFor="port">Port: </label>
          <Input
            id="port"
            data-key=".port"
            data-variant={mockServerData._configurations$.port.variant}
            value={mockServerData.port}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description: </label>
          <Input
            id="description"
            data-key=".description"
            data-variant={mockServerData._configurations$.description.variant}
            value={mockServerData.description}
            onChange={handleChange}
          />
        </div>
      </div>
      {routeForm}
      <Button type="primary" htmlType="submit" value="Submit" style={{marginRight: '0.5rem'}}>Submit</Button>
      <Button onClick={cancel}>Cancel</Button>
    </Form>
  )
}

const mapStateToProps = state => ({
  mockServers: state.mockServers
})

const mapDispatchToProps = dispatch => ({
  getMockServer: name => dispatch(getMockServer(name)),
  createAlert: (message, type) => dispatch(createAlert(message, type))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'mock_server' })(MockServerDetail))
