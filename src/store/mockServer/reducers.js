import {
  REQUEST_MOCK_SERVER,
  RECEIVE_MOCK_SERVER
} from './actions'

function mockServer(
  state = {
    fetching: false,
    data: {}
  },
  action
) {
  switch (action.type) {
    case REQUEST_MOCK_SERVER:
      return Object.assign({}, state, {
        fetching: true
      })
    case RECEIVE_MOCK_SERVER:
      return Object.assign({}, state, {
        fetching: false,
        data: action.data
      })
    default:
      return state
  }
}

export function mockServersReducer(state = {}, action) {
  switch (action.type) {
    case REQUEST_MOCK_SERVER:
    case RECEIVE_MOCK_SERVER:
      return Object.assign({}, state, {
        [action.name]: mockServer(state[action.name], action)
      })
    default:
      return state
  }
}
