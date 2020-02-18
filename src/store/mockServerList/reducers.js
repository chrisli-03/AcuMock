import {
  REQUEST_MOCK_SERVER_LIST,
  RECEIVE_MOCK_SERVER_LIST,
  DELETE_MOCK_SERVER
} from './actions'

export function mockServerListReducer(state = { fetching: false, list: [] }, action) {
  switch (action.type) {
    case REQUEST_MOCK_SERVER_LIST:
      return Object.assign({}, state, { fetching: true })
    case RECEIVE_MOCK_SERVER_LIST:
      return Object.assign({}, state, { fetching: false, list: action.mockServerList })
    case DELETE_MOCK_SERVER:
      return Object.assign({}, state, { list: state.list.filter(mockServer => mockServer !== action.mockServer) })
    default:
      return state
  }
}
