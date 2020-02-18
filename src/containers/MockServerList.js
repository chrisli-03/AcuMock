import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { Card, Button, Switch, Popconfirm, Icon } from 'antd'

import { getMockServerList } from '../store/mockServerList/actions'

import Spinner from '../components/Spinner'

const MockServerList = ({ mockServers, fetching, getMockServers }) => {
  const history = useHistory()
  useEffect(() => {
    getMockServers()
  }, [getMockServers])

  if (fetching) {
    return (
      <Spinner />
    )
  }

  const redirectTo = route => {
    history.push(route)
  }

  const toggleMockServer = (mockServer, status) => {
    axios.patch(`/api/mock_server/${mockServer}/status`, { running: status }).then(() => {

    })
  }

  const deleteMockServer = mockServer => {
    axios.delete(`/api/mock_server/${mockServer}`).then(() => {
      getMockServers()
    })
  }

  const mockServerItems = mockServers.map((mockServer, i) => (
    // <div key={i}>
    //   <MockServerLink>{mockServer}</MockServerLink>
    //   <button onClick={(event => toggleMockServer(event, mockServer, true))}>start</button>
    //   <button onClick={(event => toggleMockServer(event, mockServer, false))}>stop</button>
    //   <button onClick={(event => deleteMockServer(event, mockServer))}>delete</button>
    // </div>
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
          <Switch size="small" onChange={event => toggleMockServer(mockServer, event)} />
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
  fetching: state.mockServerList.fetching
})

const mapDispatchToProps = dispatch => ({
  getMockServers: () => dispatch(getMockServerList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MockServerList)
