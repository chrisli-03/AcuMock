import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Input, Form } from 'antd'
import { RightOutlined } from '@ant-design/icons'

const APITree = ({
  field,
  index
}) => {
  const [hide, setHide] = useState(true)

  return <div style={{marginBottom: '0.5rem'}}>
    <div className="d-flex">
      <NavLink className="d-flex" to="#" onClick={() => setHide(!hide)} style={{color: '#13c2c2'}}>
        <RightOutlined className={`${hide ? '' : 'rotate-90'}`} style={{transition: 'transform 0.2s'}} />
        <Form.Item
          style={{color: '#13c2c2'}}
          shouldUpdate={
            (prevValues, currentValues) => {
              return prevValues.get !== currentValues.get
            }
          }
        >
          {({ getFieldValue }) => {
            return getFieldValue(["get", index, "url"])
          }}
        </Form.Item>
      </NavLink>
      <Button type="link" style={{color: '#f5222d'}}>Delete API</Button>
    </div>
    <div style={{marginLeft: '1rem', paddingLeft: '0.5rem', borderLeft: '1px solid #1890ff', display: hide ? 'none' : 'block'}}>
      <Form.Item
        label="Status"
        name={[index, "status"]}
        rules={[
          { type: 'integer', transform: value => Number(value) }
        ]}
      >
        <Input />
      </Form.Item>
    </div>
  </div>
}

export default APITree
