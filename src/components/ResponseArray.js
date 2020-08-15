import React from 'react'
import { Button, Form } from 'antd'

import Response from './Response'

const ResponseArray = ({
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
              {selectType}
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
}

export default ResponseArray
