import React from 'react'
import { Button, Form, Input } from 'antd'

import Response from './Response'

const ResponseObject = ({
  field,
  route,
  getFieldValue,
  deleteBtn,
  selectType,
  newKey,
  setNewKey,
  newType,
  setNewType
}) => {
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
}

export default ResponseObject