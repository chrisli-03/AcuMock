import React from 'react'
import { Spin } from 'antd'

const Spinner = () => {
  return (
    <div className="spinner">
      <Spin tip="Loading..." size="large"></Spin>
    </div>
  )
}

export default Spinner
