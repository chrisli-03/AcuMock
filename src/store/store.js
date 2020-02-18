import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { mockServerListReducer } from './mockServerList/reducers'
import { mockServerStatusReducer } from './mockServerStatus/reducers'
import { mockServersReducer } from './mockServer/reducers'

const rootReducer = combineReducers({
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
