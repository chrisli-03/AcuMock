import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'
import APITree from './APITree'

const RequestList = ({
  type
}) => {
  const [newApi, setNewApi] = useState('')

  return <Form.List name={type.toString()}>
    {(fields, { add, remove }) =>
      <Form.Item
        style={{marginLeft: '1rem'}}
        shouldUpdate={
          (prevValues, currentValues) => {
            return prevValues !== currentValues
          }
        }
      >
        {({ getFieldValue }) =>
          <React.Fragment>
            {
              fields.map((field, index) =>
                <APITree apiType={type} field={field} index={index} route={[type, index]} key={index} remove={remove} />
              )
            }
            <Input
              placeholder="New API"
              value={newApi}
              onChange={event => {setNewApi(event.target.value)}}
            />
            <Button
              type="link"
              style={{ color: '#52c41a' }}
              onClick={() => {
                if (newApi === '' || getFieldValue([type, newApi])) return
                add({
                  response: [{
                    response_value: undefined,
                    type: 0
                  }],
                  status: '',
                  type,
                  url: newApi
                })
                setNewApi('')
              }}
            >
              Add API
            </Button>
          </React.Fragment>
        }
      </Form.Item>
    }
  </Form.List>
}

export default RequestList