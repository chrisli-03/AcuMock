import React from 'react'

import ObjectResponse from './ObjectResponse'

const APITree = ({
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
  return <div>
    <div>{api}: {'{'}</div>
    <div style={{paddingLeft: '1rem'}}>
      <label htmlFor={`${prefix}.${api}.status`}>status: </label>
      <input
        id={`${prefix}.${api}.status`}
        data-key={`${prefix}.${api}.status`}
        data-variant={configurations.status.variant}
        value={routes.status}
        onChange={handleChange}
      />
      <div>data: {'{'}</div>
      <div style={{paddingLeft: '1rem'}}>
        <ObjectResponse
          prefix={`${prefix}.${api}`}
          api='data'
          routes={routes.data}
          configurations={configurations.data}
          insertData={insertData.data}
          insertParam={insertParam}
          handleChange={handleChange}
          handleInsertChange={handleInsertChange}
          deleteParam={deleteParam}
        />
        <div>
          <input
            data-key={`${prefix}.${api}._data.name`}
            value={insertData[`_data`] ? insertData[`_data`].name : ''}
            onChange={handleInsertChange}
          />
          <select
            data-key={`${prefix}.${api}._data.variant`}
            value={insertData[`_data`] ? insertData[`_data`].variant : ''}
            onChange={handleInsertChange}
          >
            <option value="" disabled>--select--</option>
            <option value="text">text</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="object">object</option>
            <option value="array">array</option>
          </select>
          <button onClick={event => insertParam(event, `${prefix}.${api}`, 'data')}>+</button>
        </div>
      </div>
      <div>{'}'}</div>
    </div>
    <div>{'}'}</div>
  </div>
}

export default APITree
