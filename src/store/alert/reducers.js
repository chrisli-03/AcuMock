import {
  SHOW_ALERT,
  HIDE_ALERT
} from './actions'

export function alertReducer(state = {}, action) {
  switch (action.type) {
    case SHOW_ALERT:
      return Object.assign({}, state, { [action.message]: { type: action.alertType, message: action.message } })
    case HIDE_ALERT:
      const newState = Object.assign({}, state)
      delete newState[action.message]
      return newState
    default:
      return state
  }
}
