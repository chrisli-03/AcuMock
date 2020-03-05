import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Icon } from 'antd'

import { getMockServerList } from '../store/mockServerList/actions'
import { getMockServerStatus } from '../store/mockServerStatus/actions'

import Spinner from '../components/Spinner'
import MockServerItem from '../components/MockServerItem'

const MockServerList = (
  {
    mockServers,
    fetchingMockServers,
    mockServerStatus,
    fetchingMockServerStatus,
    getMockServers,
    getMockServerStatus
  }
) => {
  const history = useHistory()
  useEffect(() => {
    getMockServers()
    getMockServerStatus()
  }, [getMockServers, getMockServerStatus])

  if (fetchingMockServers || fetchingMockServerStatus) {
    return (
      <Spinner />
    )
  }

  const mockServerItems = mockServers.map((mockServer, i) => (
    <MockServerItem mockServer={mockServer} enabled={mockServerStatus[mockServer.name]} key={i} />
  ))

  return (
    <div className="mock-server-list">
      {mockServerItems}
      <div className="new-mock-server ant-card ant-card-bordered ant-card-small" style={{ width: 300 }} >
        <Button
          size="small"
          type="link"
          onClick={() => history.push('/mock_server/new')}
        >
          <Icon type="plus" />
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  mockServers: state.mockServerList.list,
  fetchingMockServers: state.mockServerList.fetching,
  mockServerStatus: state.mockServerStatus.status,
  fetchingMockServerStatus: state.mockServerStatus.fetching
})

const mapDispatchToProps = dispatch => ({
  getMockServers: () => dispatch(getMockServerList()),
  getMockServerStatus: () => dispatch(getMockServerStatus()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MockServerList)
