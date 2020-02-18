import {
  REQUEST_MOCK_SERVER_STATUS,
  RECEIVE_MOCK_SERVER_STATUS,
  UPDATE_MOCK_SERVER_STATUS
} from './actions'

export function mockServerStatusReducer(state = { fetching: false, status: {} }, action) {
  switch (action.type) {
    case REQUEST_MOCK_SERVER_STATUS:
      return Object.assign({}, state, { fetching: true })
    case RECEIVE_MOCK_SERVER_STATUS:
      return Object.assign({}, state, { fetching: false, status: action.mockServerStatus })
    case UPDATE_MOCK_SERVER_STATUS:
      return Object.assign({}, state, { status: Object.assign({}, state.status, { [action.mockServer]: action.status }) })
    default:
      return state
  }
}
