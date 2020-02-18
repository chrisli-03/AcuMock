import axios from 'axios'

export const REQUEST_MOCK_SERVER_STATUS = 'REQUEST_MOCK_SERVER_STATUS'
export const RECEIVE_MOCK_SERVER_STATUS = 'RECEIVE_MOCK_SERVER_STATUS'
export const UPDATE_MOCK_SERVER_STATUS = 'UPDATE_MOCK_SERVER_STATUS'

function requestMockServerStatus() {
  return {
    type: REQUEST_MOCK_SERVER_STATUS
  }
}

function receivedMockServerStatus(mockServerStatus) {
  return {
    type: RECEIVE_MOCK_SERVER_STATUS,
    mockServerStatus
  }
}

export function getMockServerStatus() {
  return (dispatch, getState) => {
    if (getState().mockServerStatus.fetching) return
    dispatch(requestMockServerStatus())
    axios.get('/api/mock_server_status').then(response => {
      dispatch(receivedMockServerStatus(response.data))
    })
  }
}

export function updateMockServerStatus(mockServer, status) {
  return {
    type: UPDATE_MOCK_SERVER_STATUS,
    mockServer,
    status
  }
}
