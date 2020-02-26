import React from 'react'
import { Input, Select, Radio, Button } from 'antd'

const { Option } = Select

const ResponseObject = ({
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
  const obj = Object.keys(routes).map(key => {
    const id = `${prefix}.${api}.${key}`
    if (Array.isArray(routes[key])) return []
    if (typeof routes[key] === 'object') {
      return (
        <div key={id}>
          <ResponseObject
            prefix={`${prefix}.${api}`}
            api={key}
            routes={routes[key]}
            configurations={configurations[key]}
            insertData={insertData[api]}
            insertParam={insertParam}
            handleChange={handleChange}
            handleInsertChange={handleInsertChange}
            deleteParam={deleteParam}
          />
        </div>
      )
    }
    const configuration = configurations[key]
    if (!configuration) return null
    switch (configuration.variant) {
      case 'text':
      case 'number':
        return (
          <div key={id} style={{marginBottom: '0.5rem'}}>
            <label htmlFor={id}>{key}: </label>
            <Input
              id={id}
              data-key={id}
              data-variant={configuration.variant}
              value={routes[key]}
              onChange={handleChange}
              addonBefore={configuration.variant}
            />
            <Button type="link" onClick={event => deleteParam(event, `${prefix}.${api}`, key)} style={{color: '#f5222d'}}>Delete Key</Button>
          </div>
        )
      case 'boolean':
        return (
          <div key={id} style={{marginBottom: '0.5rem'}}>
            <label htmlFor={id}>{key}: </label>
            <Radio.Group
              id={id}
              onChange={handleChange}
              value={routes[key]}
            >
              <Radio value={true} data-variant={configuration.variant} data-key={id}>True</Radio>
              <Radio value={false} data-variant={configuration.variant} data-key={id}>False</Radio>
            </Radio.Group>
            <Button type="link" onClick={event => deleteParam(event, `${prefix}.${api}`, key)} style={{color: '#f5222d'}}>Delete Key</Button>
          </div>
        )
      // case 'select':
      //   return (
      //     <div key={id}>
      //       <label htmlFor={id}>{key}: </label>
      //       <select
      //         id={id}
      //         data-key={id}
      //         data-variant={configuration.variant}
      //         value={routes[key]}
      //         onChange={handleChange}
      //       >
      //         {configuration.options.map(option => (
      //           <option value={option.value} key={`${id}_${option.value}`}>{option.label}</option>
      //         ))}
      //       </select>
      //       <button onClick={event => deleteParam(event, prefix, key)}>x</button>
      //     </div>
      //   )
      default:
        return null
    }
  })
  const selectType = <Select
    data-key={`${prefix}._${api}.variant`}
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
      {obj}
      <div style={{marginBottom: '0.5rem'}}>
        <Input
          data-key={`${prefix}._${api}.name`}
          value={insertData[`_${api}`] ? insertData[`_${api}`].name : ''}
          onChange={handleInsertChange}
          placeholder="New Key"
          addonBefore={selectType}
        />
        <Button type="link" onClick={event => insertParam(event, prefix, api)} style={{color: '#52c41a'}}>Add Key</Button>
      </div>
    </div>
  </div>
}

export default ResponseObject
