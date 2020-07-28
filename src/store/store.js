import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  )
}
