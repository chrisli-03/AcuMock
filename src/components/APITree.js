import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Input, Form } from 'antd'
import { RightOutlined } from '@ant-design/icons'

import ResponseObject from './ResponseObject'

const APITree = ({
  field,
  index,
  route
}) => {
  // const [hide, setHide] = useState(true)
  const [hide, setHide] = useState(false)

  return <div style={{marginBottom: '0.5rem'}}>
    <div className="d-flex">
      <NavLink className="d-flex" to="#" onClick={() => setHide(!hide)} style={{color: '#13c2c2'}}>
        <RightOutlined className={`${hide ? '' : 'rotate-90'}`} style={{transition: 'transform 0.2s'}} />
        <Form.Item
          style={{color: '#13c2c2'}}
          shouldUpdate={
            (prevValues, currentValues) => {
              return prevValues.get[index].url !== currentValues.get[index].url
            }
          }
        >
          {({ getFieldValue }) => {
            return getFieldValue([...route, "url"])
          }}
        </Form.Item>
      </NavLink>
      <Button type="link" style={{color: '#f5222d'}}>Delete API</Button>
    </div>
    {
      hide ? null : <div style={{marginLeft: '1rem', paddingLeft: '0.5rem', borderLeft: '1px solid #1890ff' }}>
        <Form.Item
          label="Status"
          name={[field.name, "status"]}
          rules={[
            { type: 'integer', transform: value => Number(value) }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Response Type">
          <Button
            type="link"
          >
            Object
          </Button>
          <Button
            type="link"
          >
            Array
          </Button>
        </Form.Item>
        <Form.List name={[field.name, "response"]}>
          {(fields, { add, remove }) =>
            fields.map((field, index) =>
              <ResponseObject field={field} deletable={false} route={[...route,"response", index]} />
            )
          }
        </Form.List>
      </div>
    }
  </div>
}

export default APITree
