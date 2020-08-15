import React from 'react'
import { Form, Radio } from 'antd'

const ResponseBoolean = ({
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
      <Radio.Group>
        <Radio value={true}>True</Radio>
        <Radio value={false}>False</Radio>
      </Radio.Group>
    </Form.Item>
    {deleteBtn}
  </div>
}

export default ResponseBoolean