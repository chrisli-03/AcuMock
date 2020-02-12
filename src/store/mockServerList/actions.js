export const REQUEST_MOCK_SERVER_LIST = 'REQUEST_MOCK_SERVER_LIST'
export const RECEIVE_MOCK_SERVER_LIST = 'RECEIVE_MOCK_SERVER_LIST'

function requestMockServerList() {
  return {
    type: REQUEST_MOCK_SERVER_LIST
  }
}

function receivedMockServerList(mockServerList) {
  return {
    type: RECEIVE_MOCK_SERVER_LIST,
    mockServerList
  }
}

export function getMockServerList() {
  return (dispatch, getState) => {
    if (getState().mockServerList.fetching) return
    dispatch(requestMockServerList())
    return setTimeout(() => {
      dispatch(receivedMockServerList(['mock 1', 'mock 2', 'mock 3']))
    }, 200)
  }
}
