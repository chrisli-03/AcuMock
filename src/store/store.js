import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { alertReducer } from './alert/reducers'
import { mockServerListReducer } from './mockServerList/reducers'
import { mockServerStatusReducer } from './mockServerStatus/reducers'
import { mockServersReducer } from './mockServer/reducers'

const rootReducer = combineReducers({
  alerts: alertReducer,
  mockServerList: mockServerListReducer,
  mockServers: mockServersReducer,
  mockServerStatus: mockServerStatusReducer
})

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware)
  )
}
