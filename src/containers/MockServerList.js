import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { getMockServerList } from '../store/mockServerList/actions'

import Spinner from '../components/Spinner'
import MockServerLink from '../components/MockServerLink'

const MockServerList = ({ mockServers, fetching, getMockServers }) => {
  useEffect(() => {
    getMockServers()
  }, [getMockServers])

  if (fetching) {
    return (
      <Spinner />
    )
  }

  const toggleMockServer = (event, mockServer, status) => {
    event.preventDefault()
    axios.patch(`/api/mock_server/${mockServer}/status`, { running: status }).then(() => {
      alert(`Mock Server - ${mockServer} ${status ? 'Started' : 'Stopped'}`)
    })
  }

  const deleteMockServer = (event, mockServer) => {
    event.preventDefault()
    axios.delete(`/api/mock_server/${mockServer}`).then(() => {
      alert(`Mock Server - ${mockServer} deleted`)
      getMockServers()
    })
  }

  const mockServerItems = mockServers.map((mockServer, i) => (
    <div key={i}>
      <MockServerLink>{mockServer}</MockServerLink>
      <button onClick={(event => toggleMockServer(event, mockServer, true))}>start</button>
      <button onClick={(event => toggleMockServer(event, mockServer, false))}>stop</button>
      <button onClick={(event => deleteMockServer(event, mockServer))}>delete</button>
    </div>
  ))

  return (
    <div>
      {mockServerItems}
      <MockServerLink>new</MockServerLink>
    </div>
  )
}

const mapStateToProps = state => ({
  mockServers: state.mockServerList.list,
  fetching: state.mockServerList.fetching
})

const mapDispatchToProps = dispatch => ({
  getMockServers: () => dispatch(getMockServerList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MockServerList)
