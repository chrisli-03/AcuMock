import React from 'react'
import { Alert } from 'antd'
import { connect } from 'react-redux'

import { hideAlert } from '../store/alert/actions'

const CustomAlert = (props) => {
  return (
    <Alert {...props} showIcon closeText="close" onClose={() => props.hideAlert(props.message)} />
  )
}

const mapDispatchToProps = dispatch => ({
  hideAlert: key => dispatch(hideAlert(key)),
})

export default connect(
  null,
  mapDispatchToProps
)(CustomAlert)