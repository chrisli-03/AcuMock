import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Input, Button } from 'antd'

import apiType from '../enums/apiType'
import { getMockServer } from '../store/mockServer/actions'
import { createAlert } from '../store/alert/actions'

import RequestList from '../components/RequestList'

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
      form.setFieldsValue({
        name: mockServer.data.name,
        description: mockServer.data.description,
        redirectAddress: mockServer.data.redirectAddress,
        [apiType.GET]: mockServer.data.api.filter(api => api.type === apiType.GET),
        [apiType.POST]: mockServer.data.api.filter(api => api.type === apiType.POST),
        [apiType.PUT]: mockServer.data.api.filter(api => api.type === apiType.PUT),
        [apiType.PATCH]: mockServer.data.api.filter(api => api.type === apiType.PATCH),
        [apiType.DELETE]: mockServer.data.api.filter(api => api.type === apiType.DELETE)
      })
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
        <div>Get Requests</div>
        <RequestList type={apiType.GET} />
      </Form.Item>
      <Form.Item>
        <div>Post Requests</div>
        <RequestList type={apiType.POST} />
      </Form.Item>
      <Form.Item>
        <div>Put Requests</div>
        <RequestList type={apiType.PUT} />
      </Form.Item>
      <Form.Item>
        <div>Patch Requests</div>
        <RequestList type={apiType.PATCH} />
      </Form.Item>
      <Form.Item>
        <div>Delete Requests</div>
        <RequestList type={apiType.DELETE} />
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
