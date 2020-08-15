import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Input, Button } from 'antd'

import APITree from '../components/APITree'
import apiType from '../enums/apiType'
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
      form.setFieldsValue({
        name: mockServer.data.name,
        description: mockServer.data.description,
        redirectAddress: mockServer.data.redirectAddress,
        get: mockServer.data.api.filter(api => api.type === apiType.GET),
        post: mockServer.data.api.filter(api => api.type === apiType.POST),
        put: mockServer.data.api.filter(api => api.type === apiType.PUT),
        patch: mockServer.data.api.filter(api => api.type === apiType.PATCH),
        delete: mockServer.data.api.filter(api => api.type === apiType.DELETE)
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
        <div>Get</div>
        {
          <Form.List name="get">
            {(fields, { add, remove }) =>
              fields.map((field, index) =>
                <APITree field={field} index={index} route={["get", index]} />
              )
            }
          </Form.List>
        }
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
