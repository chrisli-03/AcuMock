export const SHOW_ALERT = 'SHOW_ALERT'
export const HIDE_ALERT = 'HIDE_ALERT'

export function showAlert(message, alertType) {
  return {
    type: SHOW_ALERT,
    message,
    alertType
  }
}

export function hideAlert(message) {
  return {
    type: HIDE_ALERT,
    message
  }
}

export function createAlert(message, alertType) {
  return dispatch => {
    dispatch(showAlert(message, alertType))
    setTimeout(() => {
      dispatch(hideAlert(message))
    }, 5000)
  }
}
