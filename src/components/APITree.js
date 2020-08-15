import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Input, Radio, Form } from 'antd'
import { RightOutlined } from '@ant-design/icons'

import Response from './Response'
import responseType from '../enums/responseType'

const APITree = ({
  field,
  index,
  route
}) => {
  // todo: change back after done development
  // const [hide, setHide] = useState(true)
  const [hide, setHide] = useState(false)

  return <Form.Item
    style={{color: '#13c2c2'}}
    shouldUpdate={
      (prevValues, currentValues) => {
        return prevValues.get[index].url !== currentValues.get[index].url
      }
    }
  >
    {({ getFieldValue }) => {
       return <div style={{marginBottom: '0.5rem'}}>
        <div className="d-flex">
          <NavLink className="d-flex" to="#" onClick={() => setHide(!hide)} style={{color: '#13c2c2'}}>
            <RightOutlined className={`${hide ? '' : 'rotate-90'}`} style={{transition: 'transform 0.2s'}} />
            <div>{getFieldValue([...route, "url"])}</div>
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
            <Form.Item name={[field.name, "response", "0", "type"]} label="Response Type:">
              <Radio.Group>
                <Radio.Button value={responseType.STRING}>String</Radio.Button>
                <Radio.Button value={responseType.NUMBER}>Number</Radio.Button>
                <Radio.Button value={responseType.BOOLEAN}>Boolean</Radio.Button>
                <Radio.Button value={responseType.OBJECT}>Object</Radio.Button>
                <Radio.Button value={responseType.ARRAY}>Array</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.List name={[field.name, "response"]}>
              {(fields, { _, remove }) =>
                fields.map((field, index) =>
                  <Response
                    field={field}
                    deletable={false}
                    route={[...route, "response", index]}
                    key={index}
                    remove={remove}
                  />
                )
              }
            </Form.List>
          </div>
        }
      </div>
    }}
  </Form.Item>
}

export default APITree
