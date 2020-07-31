import React, { useState } from 'react'
import { Form, Input, Select, Radio, Button } from 'antd'

import responseType from '../enums/responseType'
const { Option } = Select

const ResponseObject = ({
  deletable = true,
  field,
  route
}) => {
  const [newKey, setNewKey] = useState('')
  const [newType, setNewType] = useState('')

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
            {
              deletable ?
              <Button type="link" style={{color: '#f5222d' }} tabIndex={-1}>Delete Key</Button> :
              null
            }
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
            {
              deletable ?
              <Button type="link" style={{color: '#f5222d'}} tabIndex={-1}>Delete Key</Button> :
              null
            }
          </div>
        case responseType.OBJECT:
          const selectType = <Select value={newType} onChange={event => {setNewType(event)}} style={{width: 100}}>
            <Option value="" disabled>--Select Type--</Option>
            <Option value={responseType.STRING}>String</Option>
            <Option value={responseType.NUMBER}>Number</Option>
            <Option value={responseType.BOOLEAN}>Boolean</Option>
            <Option value={responseType.OBJECT}>Object</Option>
            <Option value={responseType.ARRAY}>Array</Option>
          </Select>
          return <div>
            <div>
              {getFieldValue([...route, "response_key"])} (Object)
              {
                deletable ?
                <Button type="link" style={{color: '#f5222d'}} tabIndex={-1}>Delete Key</Button> :
                null
              }
            </div>
            <div style={{marginLeft: '1rem', paddingLeft: '0.5rem', borderLeft: '1px solid #1890ff'}}>
              <Form.List name={[field.name, "children"]}>
                {(fields, { add, remove }) =>
                  <React.Fragment>
                    {
                      fields.map((field, index) =>
                        <ResponseObject
                          field={field}
                          route={[...route, "children", index]}
                          key={index}
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
        case responseType.Array:
          break
        default:
          return <div>Unknown Type</div>
      }
    }}
  </Form.Item>
}

export default ResponseObject
