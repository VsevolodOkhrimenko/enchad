import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import history from 'browserHistory'
import store from 'store'
import App from 'App'

const Root = () => (
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
)

export default Root
