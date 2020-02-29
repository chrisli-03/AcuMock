import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import './App.css'

import Alert from './components/Alert'
import MockServerList from './containers/MockServerList'
import MockServerDetail from './containers/MockServerDetail'

import { connect } from 'react-redux'

function App({ alerts}) {
  const alertElements = <div className="alert-holder">
    {
      Object.keys(alerts).map(key => (
        <Alert message={alerts[key].message} type={alerts[key].type} key={key} />
      ))
    }
  </div>

  return (
    <Router>
      <div className="App">
        <header className="header">AcuMock</header>
        {alertElements}
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

const mapStateToProps = state => ({
  alerts: state.alerts
})

export default connect(
  mapStateToProps
)(App)
