import React from 'react'

const ObjectResponse = ({
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
          <ObjectResponse
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
    switch (configuration.type) {
      case 'input':
        return (
          <div key={id}>
            <label htmlFor={id}>{key}: </label>
            <input
              id={id}
              data-key={id}
              data-variant={configuration.variant}
              value={routes[key]}
              onChange={handleChange}
            />
            <button onClick={event => deleteParam(event, `${prefix}.${api}`, key)}>x</button>
          </div>
        )
      case 'select':
        return (
          <div key={id}>
            <label htmlFor={id}>{key}: </label>
            <select
              id={id}
              data-key={id}
              data-variant={configuration.variant}
              value={routes[key]}
              onChange={handleChange}
            >
              {configuration.options.map(option => (
                <option value={option.value} key={`${id}_${option.value}`}>{option.label}</option>
              ))}
            </select>
            <button onClick={event => deleteParam(event, prefix, key)}>x</button>
          </div>
        )
      default:
        return null
    }
  })
  return <div>
    <div>
      {api}: {'{'}
      {
        api !== 'data' || !/^\.routes\.(get|post|put|patch|delete)\.(\/.)+/.test(prefix) ?
        <button onClick={event => deleteParam(event, prefix, api)}>x</button> :
        null
      }
    </div>
    <div style={{paddingLeft: '1rem'}}>
      {obj}
      <div>
        <input
          data-key={`${prefix}._${api}.name`}
          value={insertData[`_${api}`] ? insertData[`_${api}`].name : ''}
          onChange={handleInsertChange}
        />
        <select
          data-key={`${prefix}._${api}.variant`}
          value={insertData[`_${api}`] ? insertData[`_${api}`].variant : ''}
          onChange={handleInsertChange}
        >
          <option value="" disabled>--select--</option>
          <option value="text">text</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="object">object</option>
          <option value="array">array</option>
        </select>
        <button onClick={event => insertParam(event, prefix, api)}>+</button>
      </div>
    </div>
    <div>{'}'}</div>
  </div>
}

export default ObjectResponse
