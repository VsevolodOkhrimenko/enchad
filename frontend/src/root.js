import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import history from 'browserHistory'
import store from 'store'
import Routes from 'routes'

const Root = () => (
  <Router history={history}>
    <Provider store={store}>
      <Routes />
    </Provider>
  </Router>
)

export default Root
