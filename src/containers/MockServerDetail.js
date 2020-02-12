import React, { useReducer, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getMockServer } from '../store/mockServer/actions'

import Spinner from '../components/Spinner'

const INIT = 'INIT'
const UPDATE = 'UPDATE'

const recursiveStateChange = (state, keys, level, value) => {
  return Object.assign({}, state, {
    [keys[level]]: level < keys.length-1 ? recursiveStateChange(state[keys[level]], keys, level+1, value) : value
  })
}

const reducer = (state, action) => {
  switch (action.type) {
    case INIT:
      return action.payload
    case UPDATE:
      const keys = action.key.split('.')
      return recursiveStateChange(state, keys, 0, action.payload)
    default:
      return state
  }
}

const MockServerDetail = ({ mockServers, getMockServer }) => {
  const { name } = useParams()
  const mockServer = mockServers[name]
  const [mockServerData, updateMockServerData] = useReducer(reducer, { name: '', port: '', routes: {} })

  useEffect(() => {
    if (name) getMockServer(name)
  }, [getMockServer, name])

  useEffect(() => {
    if (mockServer && !mockServer.fetching) updateMockServerData({ type: INIT, payload: mockServer.data })
  }, [mockServer])

  if (!mockServer || mockServer.fetching) {
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

  return (
    <div>
      <input type="text" data-key="name" value={mockServerData.name} onChange={handleChange} />
    </div>
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
