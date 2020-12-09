import React, { Suspense } from 'react'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Loader from 'components/Loader'



const LoginPage = React.lazy(() => import('containers/LoginPage'))
const MessagingPage = React.lazy(() => import('containers/MessagingPage'))

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      rest.authToken ?
        <Component {...props} />
        : <Redirect to='/login' />
    )}
  />
)

const Routes = ({ authToken }) => {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <PrivateRoute authToken={authToken} path='/:thread_id?' component={MessagingPage} />
      </Switch>
    </Suspense>
  )
}

export default Routes
