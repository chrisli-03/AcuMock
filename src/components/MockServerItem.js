import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { Card, Button, Switch, Popover, Popconfirm, Icon } from 'antd'

import { deleteMockServer } from '../store/mockServerList/actions'
import { updateMockServerStatus } from '../store/mockServerStatus/actions'

const MockServerItem = ({mockServer, enabled, deleteMockServerFromState, updateMockServerStatus}) => {
  const [updating, setUpdating] = useState(false)
  const history = useHistory()

  const toggleMockServer = (mockServer, status) => {
    setUpdating(true)
    axios.patch(`/api/mock_server/${mockServer}/status`, { running: status }).then(() => {
      updateMockServerStatus(mockServer, status)
    }).catch(err => {
      switch (err.response.status) {
        case 409:
          alert('Port already used by another mock server.')
          break
        default:
          alert('An error has occurred.')
      }
    }).finally(() => {
      setUpdating(false)
    })
  }

  const deleteMockServer = mockServer => {
    axios.delete(`/api/mock_server/${mockServer}`).then(() => {
      deleteMockServerFromState(mockServer)
    }).catch(err => {
      switch (err.response.status) {
        default:
          alert('An Error has occurred.')
      }
    })
  }

  const editBtn = <Button
    size="small"
    type="link"
    onClick={() => history.push(`/mock_server/${mockServer.name}`)}
    disabled={enabled}
  >
    edit
  </Button>
  return (
    <Card
      title={mockServer.name}
      size="small"
      extra={
        <React.Fragment>
          {
            enabled ?
            <Popover content='Disable mock server before edit.' trigger="hover">
              { editBtn }
            </Popover> :
            editBtn
          }

          <Popconfirm
            title="Are you sure delete this mock server?"
            onConfirm={() => deleteMockServer(mockServer.name)}
            okText="Yes"
            cancelText="No"
            icon={<Icon type="exclamation-circle" style={{ color: 'red' }} />}
          >
            <Button size="small" type="link" style={{ color: '#f00' }}>delete</Button>
          </Popconfirm>
          <Switch
            size="small"
            onChange={event => toggleMockServer(mockServer.name, event)}
            checked={enabled}
            disabled={updating}
          />
        </React.Fragment>
      }
      style={{ width: 300 }}
    >
      <div>{mockServer.description}</div>
    </Card>
  )
}

const mapDispatchToProps = dispatch => ({
  deleteMockServerFromState: mockServer => dispatch(deleteMockServer(mockServer)),
  updateMockServerStatus: (mockServer, status) => dispatch(updateMockServerStatus(mockServer, status))
})

export default connect(
  null,
  mapDispatchToProps
)(MockServerItem)
