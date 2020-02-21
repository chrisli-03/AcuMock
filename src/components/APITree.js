import React from 'react'
import { Input, Button } from 'antd'

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
  return <div style={{marginBottom: '0.5rem'}}>
    <div>{api} <Button type="link" onClick={event => deleteParam(event, prefix, api)} style={{color: '#f5222d'}}>Delete API</Button></div>
    <div style={{marginLeft: '1rem', paddingLeft: '0.5rem', borderLeft: '1px solid #1890ff'}}>
      <label htmlFor={`${prefix}.${api}.status`}>status: </label>
      <Input
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
  </div>
}

export default APITree
