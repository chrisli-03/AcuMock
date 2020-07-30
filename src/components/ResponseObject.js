import React from 'react'
import { Form, Input, Select, Radio, Button } from 'antd'

import responseType from '../enums/responseType'
import ResponseArray from './ResponseArray'
import APITree from './APITree'
const { Option } = Select

const ResponseObject = ({
  deletable = true,
  field,
  route
}) => {
  const selectType = <Select style={{ width: 100 }}>
    <Option value="" disabled>--Select Value Type--</Option>
    <Option value="text">text</Option>
    <Option value="number">number</Option>
    <Option value="boolean">boolean</Option>
    <Option value="object">object</Option>
    <Option value="array">array</Option>
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
              <Input addonBefore={selectType}  />
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
              style={{ marginBottom: 0 }}
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
                <Button type="link" style={{color: '#f5222d' }} tabIndex={-1}>Delete Key</Button> :
                null
            }
          </div>
        case responseType.OBJECT:
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
                  fields.map((field, index) =>
                    <ResponseObject field={field} route={[...route, "children", index]} key={index} />
                  )
                }
              </Form.List>
              <div>
                <Input
                  placeholder="New Key"
                  addonBefore={selectType}
                />
                <Button type="link" style={{color: '#52c41a'}}>Add Key</Button>
              </div>
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
