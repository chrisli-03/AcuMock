import axios from 'axios'

export const REQUEST_MOCK_SERVER = 'REQUEST_MOCK_SERVER'
export const RECEIVE_MOCK_SERVER = 'RECEIVE_MOCK_SERVER'

function requestMockServer(name) {
  return {
    type: REQUEST_MOCK_SERVER,
    name
  }
}

function receivedMockServer(name, data) {
  return {
    type: RECEIVE_MOCK_SERVER,
    name,
    data
  }
}

export function getMockServer(name) {
  return (dispatch, getState) => {
    const mockServer = getState().mockServers[name]
    if (mockServer && mockServer.fetching) return
    dispatch(requestMockServer(name))
    axios.get(`/api/mock_server/${name}`).then(response => {
      dispatch(receivedMockServer(name, response.data))
    })
  }
}
