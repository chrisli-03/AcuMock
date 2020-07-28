import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { Form, Input, Button } from 'antd'

import { getMockServer } from '../store/mockServer/actions'
import { createAlert } from '../store/alert/actions'

import Spinner from '../components/Spinner'

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
      form.setFieldsValue(mockServer.data)
    }
  }, [form, mockServer])

  if (name && (!mockServer || mockServer.fetching)) {
    return (
      <Spinner />
    )
  }

  const onFinish = event => {
    console.log(event)
    // const type = name ? 'put' : 'post'
    // const newName = name || mockServerData.name
    // axios[type](`/api/mock_server/${newName}`, mockServerData).then(response => {
    //   history.push('/')
    //   createAlert('Saved successfully', 'success')
    // })
    // event.preventDefault()
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
    <Form
      id="form"
      form={form}
      onFinish={onFinish}
      style={{padding: '0.5rem'}}
    >
      <Form.Item
        label="Name"
        name="name"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Redirect Address"
        name="redirectAddress"
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <div>Get</div>

      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{marginRight: '0.5rem'}}>Submit</Button>
        <Button onClick={cancel}>Cancel</Button>
      </Form.Item>
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
)(MockServerDetail)
