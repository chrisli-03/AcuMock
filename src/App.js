import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Button } from 'antd'
import './App.css'

import MockServerList from './containers/MockServerList'
import MockServerDetail from './containers/MockServerDetail'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <MockServerList />
          </Route>
          <Route path="/mock_server/new">
            <MockServerDetail />
          </Route>
          <Route path="/mock_server/:name">
            <MockServerDetail />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
