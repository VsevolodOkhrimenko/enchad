import React, { Suspense, useEffect } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Paper, Snackbar } from '@material-ui/core'
import {
  ErrorOutline,
  CheckCircleOutlineOutlined,
  WarningOutlined
} from '@material-ui/icons'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Loader from 'components/Loader'
import { closeSnackbar } from 'utils/common/actions'


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

const Routes = () => {
  const dispatch = useDispatch()
  const authToken = useSelector(state => state.auth.authToken)
  const useDarkTheme = useSelector(state => state.common.useDarkTheme)
  const snackbarMessage = useSelector(state => state.common.snackbarMessage)
  const snackbarType = useSelector(state => state.common.snackbarType)

  useEffect(()=> {
    const isMobileApp = !!window.ReactNativeWebView
    if (isMobileApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'theme.change',
        useDarkTheme: useDarkTheme
      }))
    }
  }, [useDarkTheme])

  const theme = createMuiTheme({
      palette: {
        type: useDarkTheme ? 'dark' : 'light'
      }
    })

  function snackbarIcon(type) {
    switch (type) {
      case 'error':
        return <ErrorOutline />
      case 'warning':
        return <WarningOutlined />
      default:
        return <CheckCircleOutlineOutlined />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper className='app-wrapper' square>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path='/login' component={LoginPage} />
            <PrivateRoute authToken={authToken} path='/:thread_id?' component={MessagingPage} />
          </Switch>
        </Suspense>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={!!snackbarMessage}
          onClose={() => dispatch(closeSnackbar())}
        >
          <div className={`snackbar-box ${snackbarType}`}>
            {snackbarIcon(snackbarType)} {snackbarMessage}
          </div>
        </Snackbar>
      </Paper>
    </ThemeProvider>
  )
}

export default Routes
