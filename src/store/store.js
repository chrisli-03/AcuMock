import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

const rootReducer = combineReducers({

})

export default function configureStore() {
  return createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
  )
}
