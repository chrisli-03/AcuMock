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
    axios.patch(`/api/mock_server/${mockServer}/status`, { running: status })
  }

  const mockServerItems = [...mockServers, 'new'].map((mockServer, i) => (
    <div>
      <MockServerLink key={i}>{mockServer}</MockServerLink>
      <button onClick={(event => toggleMockServer(event, mockServer, true))}>start</button>
      <button onClick={(event => toggleMockServer(event, mockServer, false))}>stop</button>
    </div>
  ))

  return (
    <div>
      {mockServerItems}
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