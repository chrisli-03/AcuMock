import React from 'react'
import ResponseObject from './ResponseObject'
import { Button, Input, Radio, Select } from 'antd'

const { Option } = Select

const ResponseArray = ({
  prefix,
  api,
  routes,
  configurations,
  insertData,
  insertParam,
  handleChange,
  handleInsertChange,
  deleteParam
}) => {
  const arr = routes.map((route, i) => {
    const id = `${prefix}.${api}.${i}`
    if (Array.isArray(route)) {
      return <ResponseArray
        key={`${id}.${i}`}
        prefix={`${prefix}.${api}.${i}`}
        api={`${i}`}
        routes={routes[i]}
        configurations={configurations[i]}
        insertData={insertData[api]}
        insertParam={insertParam}
        handleChange={handleChange}
        handleInsertChange={handleInsertChange}
        deleteParam={deleteParam}
      />
    }
    if (typeof route === 'object') {
      return <ResponseObject
        key={`${id}.${i}`}
        prefix={`${prefix}.${api}.${i}`}
        api={`${i}`}
        routes={routes[i]}
        configurations={configurations[i]}
        insertData={insertData[api]}
        insertParam={insertParam}
        handleChange={handleChange}
        handleInsertChange={handleInsertChange}
        deleteParam={deleteParam}
      />
    }
    const configuration = configurations[i]
    if (!configuration) return null
    switch (configuration.variant) {
      case 'text':
      case 'number':
        return (
          <div key={id} style={{marginBottom: '0.5rem'}}>
            <label htmlFor={id}>{i}: </label>
            <Input
              id={id}
              data-key={id}
              data-variant={configuration.variant}
              value={routes[i]}
              onChange={handleChange}
              addonBefore={configuration.variant}
            />
            <Button type="link" onClick={event => deleteParam(event, `${prefix}.${api}`, i)} style={{color: '#f5222d'}}>Delete Key</Button>
          </div>
        )
      case 'boolean':
        return (
          <div key={id} style={{marginBottom: '0.5rem'}}>
            <label htmlFor={id}>{i}: </label>
            <Radio.Group
              id={id}
              onChange={handleChange}
              value={routes[i]}
            >
              <Radio value={true} data-variant={configuration.variant} data-key={id}>True</Radio>
              <Radio value={false} data-variant={configuration.variant} data-key={id}>False</Radio>
            </Radio.Group>
            <Button type="link" onClick={event => deleteParam(event, `${prefix}.${api}`, i)} style={{color: '#f5222d'}}>Delete Key</Button>
          </div>
        )
      default:
        return null
    }
  })

  const selectType = <Select
      style={{ width: 200 }}
      data-key={`${prefix}._${api}`}
      value={insertData[`_${api}`] ? insertData[`_${api}`].variant : ''}
      onChange={event => handleInsertChange({ target: { value: event, dataset: { key : `${prefix}._${api}.variant` } }, preventDefault: () => {} }) }
    >
      <Option value="" disabled>--Select Value Type--</Option>
      <Option value="text">text</Option>
      <Option value="number">number</Option>
      <Option value="boolean">boolean</Option>
      <Option value="object">object</Option>
      <Option value="array">array</Option>
    </Select>
  return <div>
    <div>
      {api}
      {
        api !== 'data' || !/^\.routes\.(get|post|put|patch|delete)\.(\/.)+/.test(prefix) ?
          <Button type="link" onClick={event => deleteParam(event, prefix, api)} style={{color: '#f5222d'}}>Delete Key</Button> :
          null
      }
    </div>
    <div style={{marginLeft: '1rem', paddingLeft: '0.5rem', borderLeft: '1px solid #1890ff'}}>
      {arr}
      <div style={{marginBottom: '0.5rem'}}>
        {selectType}
        <Button type="link" onClick={event => insertParam(event, `${prefix}`, api, routes.length)} style={{color: '#52c41a'}}>Add Key</Button>
      </div>
    </div>
  </div>
}

export default ResponseArray
