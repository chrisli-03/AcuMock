import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { Card, Button, Switch, Popconfirm, Icon } from 'antd'

import { getMockServerList } from '../store/mockServerList/actions'
import { getMockServerStatus, updateMockServerStatus } from '../store/mockServerStatus/actions'

import Spinner from '../components/Spinner'

const MockServerList = (
  {
    mockServers,
    fetchingMockServers,
    mockServerStatus,
    fetchingMockServerStatus,
    getMockServers,
    getMockServerStatus,
    updateMockServerStatus
  }
) => {
  const [updatingMockServerStatus, setUpdatingMockServerStatus] = useState({})
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

  const redirectTo = route => {
    history.push(route)
  }

  const toggleMockServer = (mockServer, status) => {
    setUpdatingMockServerStatus(Object.assign({}, updatingMockServerStatus, { [mockServer]: true }))
    axios.patch(`/api/mock_server/${mockServer}/status`, { running: status }).then(() => {
      updateMockServerStatus(mockServer, status)
      setUpdatingMockServerStatus(Object.assign({}, updatingMockServerStatus, { [mockServer]: false }))
    })
  }

  const deleteMockServer = mockServer => {
    axios.delete(`/api/mock_server/${mockServer}`).then(() => {
      getMockServers()
    })
  }

  const mockServerItems = mockServers.map((mockServer, i) => (
    <Card
      title={mockServer}
      size="small"
      key={i}
      extra={
        <React.Fragment>
          <Button size="small" type="link" onClick={() => redirectTo(`/mock_server/${mockServer}`)}>edit</Button>
          <Popconfirm
            title="Are you sure delete this mock server?"
            onConfirm={() => deleteMockServer(mockServer)}
            okText="Yes"
            cancelText="No"
            icon={<Icon type="exclamation-circle" style={{ color: 'red' }} />}
          >
            <Button size="small" type="link" style={{ color: '#f00' }}>delete</Button>
          </Popconfirm>
          <Switch
            size="small"
            onChange={event => toggleMockServer(mockServer, event)}
            checked={mockServerStatus[mockServer]}
            disabled={updatingMockServerStatus[mockServer]}
          />
        </React.Fragment>
      }
      style={{ width: 300 }}
    >
      Discription Placeholder
    </Card>
  ))

  return (
    <div className="mock-server-list">
      {mockServerItems}
      <div className="new-mock-server ant-card ant-card-bordered ant-card-small" style={{ width: 300 }} >
        <Button
          size="small"
          type="link"
          onClick={() => redirectTo('/mock_server/new')}
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
  updateMockServerStatus: (mockServer, status) => dispatch(updateMockServerStatus(mockServer, status))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MockServerList)
