import 'index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'root'

const rootElement = document.getElementById('root')

ReactDOM.render(<Root />, rootElement)

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./root', () => {
    const NextRoot = require('./root').default
    ReactDOM.render(<NextRoot />, rootElement)
  })
}
