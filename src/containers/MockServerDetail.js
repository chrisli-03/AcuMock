import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { Form, Input, Button } from 'antd'

import { getMockServer } from '../store/mockServer/actions'
import { createAlert } from '../store/alert/actions'

import Spinner from '../components/Spinner'

const defaultMockServer = {
  name: '',
  description: '',
  routes: []
}

const MockServerDetail = ({ mockServers, getMockServer, createAlert }) => {
  const { name } = useParams()
  const [form] = Form.useForm();
  const history = useHistory()
  const mockServer = mockServers[name]

  useEffect(() => {
    if (name) getMockServer(name)
  }, [getMockServer, name])

  useEffect(() => {
    if (mockServer && !mockServer.fetching) {

    }
  }, [mockServer])

  if (name && (!mockServer || mockServer.fetching)) {
    return (
      <Spinner />
    )
  }

  const handleSubmit = event => {
    // const type = name ? 'put' : 'post'
    // const newName = name || mockServerData.name
    // axios[type](`/api/mock_server/${newName}`, mockServerData).then(response => {
    //   history.push('/')
    //   createAlert('Saved successfully', 'success')
    // })
    event.preventDefault()
  }

  const cancel = event => {
    event.preventDefault()
    history.push('/')
  }

  const generateRouteForm = () => {
    return <div>place holder</div>
  }

  const routeForm = generateRouteForm()

  return (
    <Form id="form" form={form} onSubmit={handleSubmit} style={{padding: '0.5rem'}}>
      <div style={{marginBottom: '0.5rem'}}>
        <div style={{marginBottom:'0.5rem'}}>
          <label htmlFor="name">Name: </label>
          <Input
            id="name"
            data-key="name"
          />
        </div>
        <div>
          <label htmlFor="description">Description: </label>
          <Input
            id="description"
            data-key="description"
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
