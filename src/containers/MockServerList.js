import React, { useEffect } from 'react'
import { connect } from 'react-redux'
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

  const mockServerItems = [...mockServers, 'new'].map((mockServer, i) =>
    <MockServerLink key={i}>{mockServer}</MockServerLink>
  )

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
