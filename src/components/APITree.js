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
      <ObjectResponse
        prefix={`${prefix}.${api}`}
        api='data'
        routes={routes.data}
        configurations={configurations.data}
        insertData={insertData}
        insertParam={insertParam}
        handleChange={handleChange}
        handleInsertChange={handleInsertChange}
        deleteParam={deleteParam}
      />
    </div>
    <div>{'}'}</div>
  </div>
}

export default APITree
