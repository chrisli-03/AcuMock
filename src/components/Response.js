import React, { useState } from 'react'
import { Form, Select, Button } from 'antd'

import ResponseString from './ResponseString'
import ResponseNumber from './ResponseNumber'
import ResponseBoolean from './ResponseBoolean'
import ResponseObject from './ResponseObject'
import ResponseArray from './ResponseArray'
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

  const selectType = <Select value={newType} onChange={event => {setNewType(event)}} style={{width: 200}}>
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
          return <ResponseString
            field={field}
            route={route}
            getFieldValue={getFieldValue}
            deleteBtn={deleteBtn}
          />
        case responseType.NUMBER:
          return <ResponseNumber
            field={field}
            route={route}
            getFieldValue={getFieldValue}
            deleteBtn={deleteBtn}
          />
        case responseType.BOOLEAN:
          return <ResponseBoolean
            field={field}
            route={route}
            getFieldValue={getFieldValue}
            deleteBtn={deleteBtn}
          />
        case responseType.OBJECT:
          return <ResponseObject
            field={field}
            route={route}
            getFieldValue={getFieldValue}
            deleteBtn={deleteBtn}
            selectType={selectType}
            newKey={newKey}
            setNewKey={setNewKey}
            newType={newType}
            setNewType={setNewType}
          />
        case responseType.ARRAY:
          return <ResponseArray
            field={field}
            route={route}
            getFieldValue={getFieldValue}
            deleteBtn={deleteBtn}
            selectType={selectType}
            newKey={newKey}
            setNewKey={setNewKey}
            newType={newType}
            setNewType={setNewType}
          />
        default:
          return <div>Unknown Type</div>
      }
    }}
  </Form.Item>
}

export default Response
