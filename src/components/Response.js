import React, { useState } from 'react'
import { Form, Input, Select, Radio, Button } from 'antd'

import responseType from '../enums/responseType'
const { Option } = Select

const Response = ({
  deletable = true,
  field,
  route,
  remove
}) => {
  const [newKey, setNewKey] = useState('')
  const [newType, setNewType] = useState('')

  const deleteBtn = deletable ?
    <Button
      type="link"
      style={{color: '#f5222d'}}
      tabIndex={-1}
      onClick={() => {remove(field.name)}}
    >
      Delete Key
    </Button> :
    null

  const selectType = <Select value={newType} onChange={event => {setNewType(event)}} style={{width: 100}}>
    <Option value="" disabled>--Select Type--</Option>
    <Option value={responseType.STRING}>String</Option>
    <Option value={responseType.NUMBER}>Number</Option>
    <Option value={responseType.BOOLEAN}>Boolean</Option>
    <Option value={responseType.OBJECT}>Object</Option>
    <Option value={responseType.ARRAY}>Array</Option>
  </Select>

  return <Form.Item
    shouldUpdate={
      (prevValues, currentValues) => {
        return prevValues !== currentValues
      }
    }
  >
    {({ getFieldValue }) => {
      switch(getFieldValue([...route, "type"])) {
        case responseType.STRING:
        case responseType.NUMBER:
          return <div className="d-flex">
            <Form.Item
              style={{marginBottom: 0}}
              label={getFieldValue([...route, "response_key"])}
              name={[field.name, "response_value"]}
            >
              <Input addonBefore="type" />
            </Form.Item>
            {deleteBtn}
          </div>
        case responseType.BOOLEAN:
          return <div className="d-flex">
            <Form.Item
              style={{marginBottom: 0}}
              label={getFieldValue([...route, "response_key"])}
              name={[field.name, "response_value"]}
            >
              <Radio.Group>
                <Radio value={true}>True</Radio>
                <Radio value={false}>False</Radio>
              </Radio.Group>
            </Form.Item>
            {deleteBtn}
          </div>
        case responseType.OBJECT:
          return <div>
            <div>
              {getFieldValue([...route, "response_key"])} (Object)
              {deleteBtn}
            </div>
            <div style={{marginLeft: '1rem', paddingLeft: '0.5rem', borderLeft: '1px solid #1890ff'}}>
              <Form.List name={[field.name, "children"]}>
                {(fields, { add, remove }) =>
                  <React.Fragment>
                    {
                      fields.map((field, index) =>
                        <Response
                          field={field}
                          route={[...route, "children", index]}
                          key={index}
                          remove={remove}
                        />
                      )
                    }
                    <div>
                      <Input
                        placeholder="New Key"
                        addonBefore={selectType}
                        value={newKey}
                        onChange={event => {setNewKey(event.target.value)}}
                      />
                      <Button
                        type="link"
                        style={{color: '#52c41a'}}
                        onClick={() => {
                          if (newKey === '' || newType === '' || getFieldValue([...route, newKey])) return
                          setNewKey('')
                          setNewType('')
                          add({
                            children: [],
                            fixed: 1,
                            response_key: newKey,
                            response_value: null,
                            type: Number(newType)
                          })
                        }}
                      >
                        Add Key
                      </Button>
                    </div>
                  </React.Fragment>
                }
              </Form.List>
            </div>
          </div>
        case responseType.ARRAY:
          return <div>
            <div>
              {getFieldValue([...route, "response_key"])} (Array)
              {deleteBtn}
            </div>
            <div style={{marginLeft: '1rem', paddingLeft: '0.5rem', borderLeft: '1px solid #fa8c16'}}>
              <Form.List name={[field.name, "children"]}>
                {(fields, { add, remove }) =>
                  <React.Fragment>
                    {
                      fields.map((field, index) =>
                        <Response
                          field={field}
                          route={[...route, "children", index]}
                          key={index}
                          remove={remove}
                        />
                      )
                    }
                    <div>
                      <Button
                        type="link"
                        style={{color: '#52c41a'}}
                        onClick={() => {
                          if (newType === '') return
                          setNewKey('')
                          setNewType('')
                          add({
                            children: [],
                            fixed: 1,
                            response_key: newKey,
                            response_value: null,
                            type: Number(newType)
                          })
                        }}
                      >
                        Add Key
                      </Button>
                    </div>
                  </React.Fragment>
                }
              </Form.List>
            </div>
          </div>
        default:
          return <div>Unknown Type</div>
      }
    }}
  </Form.Item>
}

export default Response
