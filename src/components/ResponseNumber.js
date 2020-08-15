import React from 'react'
import { Form, Input } from 'antd'

const ResponseNumber = ({
  field,
  route,
  getFieldValue,
  deleteBtn
}) => {
  return <div className="d-flex">
    <Form.Item
      style={{marginBottom: 0}}
      label={getFieldValue([...route, "response_key"])}
      name={[field.name, "response_value"]}
    >
      <Input addonBefore="Number" />
    </Form.Item>
    {deleteBtn}
  </div>
}

export default ResponseNumber